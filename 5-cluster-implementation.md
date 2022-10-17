# Implementing the cluster api/controller

**Objective:** Define the `DockerCluster` API and implement the corresponding reconciliation logic.

- [Implementing the cluster api/controller](#implementing-the-cluster-apicontroller)
	- [Background](#background)
	- [Define `DockerCluster` API](#define-dockercluster-api)
	- [Implementing Reconciliation](#implementing-reconciliation)
		- [Implement Reconcile Pattern](#implement-reconcile-pattern)
		- [Implement create/update reconciliation](#implement-createupdate-reconciliation)
		- [Implement delete reconciliation](#implement-delete-reconciliation)
		- [Setup the controller](#setup-the-controller)

## Background

When designing the `DockerCluster` api kind we need to make sure that we adhere to the contract for a [Cluster Infrastructure Provider](https://cluster-api.sigs.k8s.io/developer/providers/cluster-infrastructure.html) and expose enough information to the user so that we can create any required infrastructure for the cluster (but not machines for nodes).

In our example the infrastructure we need to provision is a load balancer to sit in front of our the api servers of our control plane nodes (that will be provisioned later). To do this we will create an instances of a HAProxy container. The address of the load balancer will be used in the `controlPlaneEndPoint`.

When implementing the controller for `DockerCluster` (and `DockerMachine`) you will generally follow a pattern similar to this:

1. In **Reconcile** get the instance of the API type being reconciled
2. Get the owning CAPI type (i.e. if we are reconciling **DockerCluster** then we get **Cluster**)
   1. You may need to other types if you are reconciling machines
3. If we don't have the owning CAPI type (because the "owner reference isn't set yet") then exit
4. If the instance has a non-zero deletion timestamp, then call a **reconcileDelete** function that does:
   1. do any actions to delete the infrastructure
   2. remove the finalizer & save/patch
5. If the has a zero deletion timestamp, then call a **reconcileNormal** function that does:
   1. add a finalizer and save/patch
   2. do any actions to create OR update the infrastructure

## Define `DockerCluster` API

1. Read the [contract](https://cluster-api.sigs.k8s.io/developer/providers/cluster-infrastructure.html) for a cluster infrastructure provider.
2. Open `api/v1alpha1/dockercluster_types.go` in your favourite editor.
3. Add the required fields to satisfy the contract:
   1. Add  this import `clusterv1 "sigs.k8s.io/cluster-api/api/v1beta1"`
   2. Add a field for the control plane endpoint to **DockerClusterSpec**:
   ```go
	// ControlPlaneEndpoint represents the endpoint used to communicate with the control plane.
	// +optional
	ControlPlaneEndpoint clusterv1.APIEndpoint `json:"controlPlaneEndpoint"`
   ```
   3. Add a **Ready** field to **DockerClusterStatus**:
   ```go
	// Ready indicates that the cluster is ready.
	// +optional
	// +kubebuilder:default=falctrl.SetupSignalHandler()se
	Ready bool `json:"ready"`
   ```
4. Now add the provider specific fields to the **DockerClusterSpec**. In our example we will allow the user to optionally override the image to use for the loadbalancer. Add the following:
```go
	// LoadBalancerImage allows you override the load balancer image. If not specified a
	// default image will be used.
	// +optional
	LoadBalancerImage string `json:"loadbalancerImage,omitempty"`
```
5. As we will be creating external infrastructure we will need to use finalizers. So define a finalizer for:
```go
const (
	// ClusterFinalizer allows cleaning up resources associated with 
	// DockerCluster before removing it from the apiserver.
	ClusterFinalizer = "dockercluster.infrastructure.cluster.x-k8s.io"
)
```
> Finalizers are used to mark an object to stop Kubernetes deleting it until the finalizer is removed. This allows us to delete any external infrastructure such as a conatiner instance before removing the object. You can read more about finalizers [here](https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/) and [here](https://book.kubebuilder.io/reference/using-finalizers.html).
6. Update the generated code and manifests by running:

```shell
make generate
make manifests
```

**Additional Notes:**

- Note the `+optional` and `+kubebuilder:default=false` in the comments. These are special comments that enable you to add validation to your CRD fields (via OpenAPI schema). Its advisable to add validation where possible. The list of available validations can be seen [here](https://book.kubebuilder.io/reference/markers/crd-validation.html).
- the contract also has a number of optional fields related within **status** to reporting failures. In your own provider its advisable that you implement these.
- although not part of the contract, historically providers have added conditions to the **status**. We will not be using conditions but if you want to learn more read [this](https://maelvls.dev/kubernetes-conditions/).

## Implementing Reconciliation

**Background:** In this section we will be implementing the reconciliation of the **DockerCluster**. The purpose of the __infrastructure cluster__ is to create any required infrastructure for the cluster but not anything related to individual machines/nodes. In the case of the tutorial we will be implementing the pattern mention above and creating a load balancer container instance that will be used to load balance requests to the control plane nodes (when they are created).

### Implement Reconcile Pattern

1. Add a reference to the packages we need. in your terminal run:

```shell
go get github.com/capi-samples/cluster-api-provider-docker/pkg
```

> We will be reusing various packages from the reference implementation so that we can focus on the provider implementation on the specific internals of docker.

2. Open `controllers/dockercluster_controller.go` in your editor. The rest of the steps in this section will relate to this file unless explicitly stated otherwise.
3. Change the signature of **Reconcile** to match:
```go
func (r *DockerClusterReconciler) Reconcile(ctx context.Context, req ctrl.Request) (_ ctrl.Result, rerr error) {
```
5. Our controller will need read RBAC permission for **Cluster**. So add the following to the comment for **Reconcile**:
```go
// +kubebuilder:rbac:groups=cluster.x-k8s.io,resources=clusters;clusters/status,verbs=get;list;watch
```
6. We will be interacting with the container runtime, to support this:
   1. Add `"github.com/capi-samples/cluster-api-provider-docker/pkg/container"` as an import
   2. Add a struct level field to hold a reference to the container runtime to **DockerClusterReconciler**:
   ```go
   type DockerClusterReconciler struct {
		client.Client
		Scheme           *runtime.Scheme
		ContainerRuntime container.Runtime
	}
   ```
   3. 
7. In the **Reconcile** make these changes:
   1. We will be creating log entries so save the logger to a variable
   ```go
   logger := log.FromContext(ctx)
   ```
   2. Add the container runtime information to the context so it can be used later:
	```go
	ctx = container.RuntimeInto(ctx, r.ContainerRuntime)
	```
   3. Change this import `infrastructurev1alpha1 "github.com/capi-samples/cluster-api-provider-docker/api/v1alpha1"` to `infrav1 "github.com/capi-samples/cluster-api-provider-docker/api/v1alpha1"` and update the import name in **SetupWithManager**
   > The convention is to import your api with the major api version in the name only. The reason is when introducing a new api version you just update the import and not the import alias so as to reduce the number of code changes.
   1. Add the following imports:
   ```go
	apierrors "k8s.io/apimachinery/pkg/api/errors"

	"sigs.k8s.io/cluster-api/util"
	"sigs.k8s.io/cluster-api/util/annotations"
	"sigs.k8s.io/cluster-api/util/patch"

	"github.com/capi-samples/cluster-api-provider-docker/pkg/docker"
	```
   1. You can delete the `// TODO(user): your logic here` comment.
   2. We need to get the instance of the **DockerCluster** from the request. And if the instance is not found exit reconciliation. Add the following:
   ```go
   dockerCluster := &infrav1.DockerCluster{}
	if err := r.Client.Get(ctx, req.NamespacedName, dockerCluster); err != nil {
		if apierrors.IsNotFound(err) {
			return ctrl.Result{}, nil
		}
		return ctrl.Result{}, err
	}
   ```
   6. Next get the owning type of the **DockerCluster** which is the CAPI **Cluster**. We can use a helper function from CAPI that will look at the ownerReferences. If it returns nil then we can requeue:
	```go
		// Get the Cluster
	cluster, err := util.GetOwnerCluster(ctx, r.Client, dockerCluster.ObjectMeta)
	if err != nil {
		return ctrl.Result{}, err
	}
	if cluster == nil {
		logger.Info("Waiting for Cluster Controller to set OwnerRef on DockerCluster")
		return ctrl.Result{}, nil
	}

	```
   7. Now we have the cluster we can update the logger to include the cluster name in later log lines:
   ```go
	logger = logger.WithValues("cluster", klog.KObj(cluster))
	ctx = ctrl.LoggerInto(ctx, logger)
   ```
   > You can add any name/value pairs that would aid in the support of your provider.
   8. Reconciliation can be paused, for  instance when you pivot from an ephemeral bootstrap cluster to a permanent management cluster (i.e. via [clusterctl move](https://cluster-api.sigs.k8s.io/clusterctl/commands/move.html)). We can check if the reconciliation is paused by looking for a annotation:
   ```go
	if annotations.IsPaused(cluster, dockerCluster) {
		logger.Info("DockerCluster or owning Cluster is marked as paused, not reconciling")

		return ctrl.Result{}, nil
	}
   ```
   9. We will be using a helper to manage the lifecycle of the load balancer we will be created. So create a new instance of this:
   ```go
   	// Create a helper for managing a docker container hosting the loadbalancer.
	externalLoadBalancer, err := docker.NewLoadBalancer(ctx, cluster, dockerCluster)
	if err != nil {
		return ctrl.Result{}, errors.Wrapf(err, "failed to create helper for managing the externalLoadBalancer")
	}
   ```
   > Some providers follow a **Scope & Services** pattern. So instead of creating a loadbalancer helper they would create a **Cluster Scope** at this point which will hold everything that is required for reconciliation. If you are interested have a look at the [example from Cluster API Provider AWS](https://github.com/kubernetes-sigs/cluster-api-provider-aws/blob/main/controllers/awscluster_controller.go#L181:L188)
   10. When we exit reconciliation we want to persistent any changes to **DockerCluster** and this is done by using patchhelper:
   ```go
	// Initialize the patch helper
	patchHelper, err := patch.NewHelper(dockerCluster, r.Client)
	if err != nil {
		return ctrl.Result{}, err
	}
	// Always attempt to Patch the DockerCluster object and status after each reconciliation.
	defer func() {
		if err := patchHelper.Patch(ctx, dockerCluster); err != nil {
			logger.Error(err, "failed to patch DockerCluster")
			if rerr == nil {
				rerr = err
			}
		}
	}()
   ```
   > If we where using conditions then we would need to set the condition values here as part of the patch.
   11. Now we are at the position of being able to do the actions thare are specific to the Docker provider for create/update (i.e. **reconcileNormal**) and delete (i.e. **reconcileDelete**). Replace `return ctrl.Result{}, nil` with
   ```go
   	// Handle deleted clusters
	if !dockerCluster.DeletionTimestamp.IsZero() {
		return r.reconcileDelete(ctx, dockerCluster, externalLoadBalancer)
	}

	// Handle non-deleted clusters
	return r.reconcileNormal(ctx, dockerCluster, externalLoadBalancer)
   ```
   12. Add the following 2 empty functions:
   ```go
   func (r *DockerClusterReconciler) reconcileNormal(ctx context.Context, dockerCluster *infrav1.DockerCluster, externalLoadBalancer *docker.LoadBalancer) (ctrl.Result, error) {
	return ctrl.Result{}, nil
	}

	func (r *DockerClusterReconciler) reconcileDelete(ctx context.Context, dockerCluster *infrav1.DockerCluster, externalLoadBalancer *docker.LoadBalancer) (ctrl.Result, error) {
		return ctrl.Result{}, nil
	}
   ```
7. We are now ready to move onto implementing the create/update functionality.

### Implement create/update reconciliation

1. We will continue to make changes in `controllers/dockercluster_controller.go`.
2. Add the following imports:
   ```go
   clusterv1 "sigs.k8s.io/cluster-api/api/v1beta1"
   "sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
   ```
3. Go to the `reconcileNormal`.
4. Get the logger and log that we are reconciling for **Docker Cluster**:
```go
logger := log.FromContext(ctx)
logger.Info("Reconciling DockerCluster")
```
5. We want to ensure that the finalizer for **DockerCluster** is added so that when we delete later we get the chance to do any cleanup:
```go
if !controllerutil.ContainsFinalizer(dockerCluster, infrav1.ClusterFinalizer) {
	controllerutil.AddFinalizer(dockerCluster, infrav1.ClusterFinalizer)

	return ctrl.Result{Requeue: true}, nil
}
```
> Note the use of `return ctrl.Result{Requeue: true}, nil`. This means that after we have added the finalizer we will exit reconciliation and our DockerCluster is patched. The **Requeue: true** will then cause the **Reconciliation** to be called again. This is a common pattern to ensure changes are persisted and as such its important to ensure your reconciliation logic is **idempotent**.
6. Now we can create the load balancer container instances:
```go
// Create the docker container hosting the load balancer.
if err := externalLoadBalancer.Create(ctx); err != nil {
	return ctrl.Result{}, errors.Wrap(err, "failed to create load balancer")
}
```
7. Now get the IP address of the load balancer container:
```go
// Get the load balancer IP so we can use it for the enpoint address
lbIP, err := externalLoadBalancer.IP(ctx)
if err != nil {
	return ctrl.Result{}, errors.Wrap(err, "failed to get ip for the load balancer")
}
```
8. Use the ip address to set the endpoint for the control plane. This is required so that CAPI can use it when creating the kubeconfig for our cluster:
```go
dockerCluster.Spec.ControlPlaneEndpoint = clusterv1.APIEndpoint{
	Host: lbIP,
	Port: 6443,
}
```
9. Finally set the **Ready** status property to true to indicate to CAPI that the infrastructure is ready and it can continue with creating the cluster:
```go
dockerCluster.Status.Ready = true
```
10. We can now move on to implementing deletion

### Implement delete reconciliation

1. We will continue to make changes in `controllers/dockercluster_controller.go`.
2. Go to the `reconcileDelete`.
3. Get the logger and log that we are reconciling for **Docker Cluster**:
```go
logger := log.FromContext(ctx)
logger.Info("Reconciling DockerCluster deletion")
```
4. Delete any external infrastructure. Fo our provider we need to delete the instance of the load balancer container:
```go
// Delete the docker container hosting the load balancer
if err := externalLoadBalancer.Delete(ctx); err != nil {
	return ctrl.Result{}, errors.Wrap(err, "failed to delete load balancer")
}
```
5. As all the external infrastructure is deleted we can remove the finalizer:
```go
// Cluster is deleted so remove the finalizer.
controllerutil.RemoveFinalizer(dockerCluster, infrav1.ClusterFinalizer)
```

### Setup the controller

1. We need to tell __controller-runtime__ what resources our controller should be reconciling. This is done within the **SetupWithManager** function.
2. Add the following imports:
```go
"sigs.k8s.io/controller-runtime/pkg/handler"
"sigs.k8s.io/controller-runtime/pkg/source"

"sigs.k8s.io/cluster-api/util/predicates"
"github.com/capi-samples/cluster-api-provider-docker/pkg/container"
```
3. Change the signature of the **SetupWithManager** function so it accepts the context:
```go
func (r *DockerClusterReconciler) SetupWithManager(ctx context.Context, mgr ctrl.Manager) error
```
4. Delete the contents of the **SetupWithManager** function
5. Add the following to the function:
```go
	c, err := ctrl.NewControllerManagedBy(mgr).
		For(&infrav1.DockerCluster{}).
		//WithOptions(options).
		WithEventFilter(predicates.ResourceNotPaused(ctrl.LoggerFrom(ctx))).
		Build(r)
	if err != nil {
		return err
	}
```
> This tells controller runtime to call **Reconcile** when there is a change to **DockerCluster**. Additionally you can add predicates (or event filters) to stop reconciliation occurring in certain situations. In this instance we use `WithEventFilter(predicates.ResourceNotPaused` to ensure reconciliation is not caused when reconciliation is paused. You can also customize the settings of the "controller manager" by using `WithOptions(options)` if needed, this often used to limit the number of concurrent reconciliations.
6. In addition to the controller reconcilining on changes to **DockerCluster** we would also like it to happen if there are changes to its owning **Cluster**. Controller runtime allows you to watch a different resource type and then decide if you want to enqueue a request for reconciliation. Add the following:
```go
return c.Watch(
	&source.Kind{Type: &clusterv1.Cluster{}},
	handler.EnqueueRequestsFromMapFunc(util.ClusterToInfrastructureMapFunc(ctx, infrav1.GroupVersion.WithKind("DockerCluster"), mgr.GetClient(), &infrav1.DockerCluster{})),
	predicates.ClusterUnpaused(ctrl.LoggerFrom(ctx)),
)
```
> This is saying to watch **clusterv1.Cluster** and if there is a change to **Cluster** get the child **DockerCluster** name/namespace using `util.ClusterToInfrastructureMapFunc(ctx, infrav1.GroupVersion.WithKind("DockerCluster"), mgr.GetClient(), &infrav1.DockerCluster{})` and then use that name/namespace to enqueue a requests for reconciliation of the **DockerCluster** with that name/namespace using `handler.EnqueueRequestsFromMapFunc`. This will then result in **Reconciliation** being called
7. As we have changed the parameters to **SetupWithManager** go to `main.go`.
8. In the **main** function make these changes:
   1. Add the following before we create the reconcilers:
   ```go
   ctx := ctrl.SetupSignalHandler()
   	// Set our runtime client into the context for later use
	runtimeClient, err := container.NewDockerClient()
	if err != nil {
		setupLog.Error(err, "unable to establish container runtime connection", "controller", "reconciler")
		os.Exit(1)
	}
   ```
   > This setups signal handlers so that the controllers can be gracefully terminated.
   2. Update the creation of **DockerClusterReconciler** to pass in the **runtimeClient** and the call to **SetupWithManager** on to pass in the context:
   ```go
	if err = (&controllers.DockerClusterReconciler{
		Client:           mgr.GetClient(),
		Scheme:           mgr.GetScheme(),
		ContainerRuntime: runtimeClient,
	}).SetupWithManager(ctx, mgr); err != nil {
		setupLog.Error(err, "unable to create controller", "controller", "DockerCluster")
		os.Exit(1)
	}
   ```
   1. Change the `mgr.Start` to use the context created earlier:
   ```go
   if err := mgr.Start(ctx); err != nil {
   ```
9. Ensure that all the api types are registered:
   1. Add `clusterv1 "sigs.k8s.io/cluster-api/api/v1beta1"` as an import in `main.go` 
   2. Add this api top the scheme by adding
10.  Run the following from a terminal:
```shell
make manifests
make build
```