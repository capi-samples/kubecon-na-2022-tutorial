# Implementing the machine controller

**Objective:** Define the `DockerMachine` API and implement the corresponding reconciliation logic.

- [Implementing the machine api/controller](#implementing-the-machine-apicontroller)
	- [Background](#background)
	- [Define `DockerMachine` API](#define-dockermachine-api)
	- [Implementing Reconciliation](#implementing-reconciliation)
		- [Implement Reconcile Pattern](#implement-reconcile-pattern)
		- [Implement create/update reconciliation](#implement-createupdate-reconciliation)
		- [Implement delete reconciliation](#implement-delete-reconciliation)
		- [Setup the controller](#setup-the-controller)
	- [Adding the DockerMachineTemplate Resource](#adding-the-dockermachinetemplate-resource)


## Background

The Machine represents a request for a kubernetes node (either control plane or worker), and thus when designing the `DockerMachine` API kind we need to:
1. Make sure we adhere to the CAPI contract for a [Machine Infrastructure Provider](https://cluster-api.sigs.k8s.io/developer/providers/machine-infrastructure.html)
2. Make sure we expose enough information to the user so that we can create the compute infrastructure that will run the kubernetes nodes (e.g., containers, VMs, or metal hosts).

In our example, we will provision a Docker container for each `DockerMachine`.  You will see that the pattern for the `DockerMachine` **Reconcile** function follows that of the `DockerCluster`.

## Define `DockerMachine` API
**Note:** The provider that we will write will contain **only** the required specs.

1. Open `api/v1alpha1/dockermachine_types.go` in your favorite editor.
2. Remove the `Foo` field that was added by the scaffolding.
3. Add the `ProviderID` field to **DockerMachineSpec**, which will contain a unique identifier for this `DockerMachine` instance:
```go
// ProviderID is the identifier for the DockerMachine instance
ProviderID *string `json:"providerID,omitempty"`
```
4. Add the `Ready` field to **DockerMachineStatus**, which indicates to CAPI that the infrastructure is ready, and add `Addresses` which returns the IP address(es) for the node:
```go
// Ready indicates the docker infrastructure has been provisioned and is ready
// +optional
Ready bool `json:"ready"`

// Addresses contains the associated addresses for the docker machine.
// +optional
Addresses []clusterv1.MachineAddress `json:"addresses,omitempty"`
```
5. As we will be creating external infrastructure, we will need to use finalizers. So define a finalizer:
```go
const (
	// MachineFinalizer allows cleaning up resources associated with
	// DockerMachine before removing it from the API Server.
	MachineFinalizer = "dockermachine.infrastructure.cluster.x-k8s.io"
)
```
6. Update the generated code and manifests by running:

```shell
make generate
make manifests
```

## Implementing Reconciliation

**Background:** In this section we will be implementing the reconciliation of the `DockerMachine`. The purpose of the __infrastructure machine__ is to create any required infrastructure for an individual machine/node. In the case of the tutorial we will be implementing the pattern mention above and creating a Docker container instance that will be bootstrapped into a kubernetes node.

### Implement Reconcile Pattern
**For brevity, you may download [dockermachine_controller.go](https://github.com/capi-samples/cluster-api-provider-docker/blob/main/controllers/dockermachine_controller.go) and [main.go](https://github.com/capi-samples/cluster-api-provider-docker/blob/main/main.go) rather than copy-pasting each section of code separately.**

1. Open `controllers/dockermachine_controller.go` in your editor. The rest of the steps in this section will relate to this file unless explicitly stated otherwise.
2. Change the signature of **Reconcile** to match:
```go
func (r *DockerMachineReconciler) Reconcile(ctx context.Context, req ctrl.Request) (_ ctrl.Result, reterr error) {
```
3. Our controller will need read RBAC permission for `Machine`s. So add the following to the comment for **Reconcile**:
```go
//+kubebuilder:rbac:groups=cluster.x-k8s.io,resources=machines;machines/status,verbs=get;list;watch
```
4. Copy the imports and implementation of the **Reconcile** function from [here](https://github.com/capi-samples/cluster-api-provider-docker/blob/main/controllers/dockermachine_controller.go), which is very similar to the corresponding function for **DockerCluster**:
   1. Set up logging
   2. Fetch the `DockerMachine` instance that we are now reconciling
   3. Fetch the corresponding `Machine` that owns this `DockerMachine`, return if the OwnerRef hasn't been set
   4. Fetch the corresponding `Cluster` (CAPI labels each infrastructure Machine with the cluster name, and **util.GetClusterFromMetadata()** uses that information)
   5. Fetch the corresponding `DockerCluster` (using `cluster.Spec.InfrastructureRef`)
   6. Use **defer** to persistent any changes to `DockerMachine` when we finish a reconciliation
   7. Return early if the `DockerMachine` or `Cluster` is paused
   8. Add the deletion finalizer to the `DockerMachine`
   9. Get references to **externalMachine** (helper for the Docker container representing this `DockerMachine`) and **externalLoadBalancer** (helper for the load balancer created in the cluster reconciliation.
   10. Call the corresponding functions for deleted or non-deleted machines.

### Implement create/update reconciliation

1. We will continue to make changes in `controllers/dockermachine_controller.go`.
2. Add the following to the **DockerMachineReconciler** struct:
```go
ContainerRuntime container.Runtime
Tracker          *remote.ClusterCacheTracker
```
3. Add the shell for the **reconcileNormal** function, the following steps will add to it:
```go
func (r *DockerMachineReconciler) reconcileNormal(ctx context.Context, cluster *clusterv1.Cluster, machine *clusterv1.Machine, dockerMachine *infrastructurev1alpha1.DockerMachine, externalMachine *docker.Machine, externalLoadBalancer *docker.LoadBalancer) (_ ctrl.Result, retErr error) {
	logger := log.FromContext(ctx)
}
```
4. If the cluster isn't ready, return until it is:
```go
// Check if the infrastructure is ready, otherwise return and wait for the cluster object to be updated
if !cluster.Status.InfrastructureReady {
	logger.Info("Waiting for DockerCluster Controller to create cluster infrastructure")
	return ctrl.Result{}, nil
}
```
5. If the `DockerMachine` already has the `ProviderID` set, that means we're done, so we can return:
```go
// if the machine is already provisioned, return
if dockerMachine.Spec.ProviderID != nil {
	// ensure ready state is set.
	// This is required after move, because status is not moved to the target cluster.
	dockerMachine.Status.Ready = true
	return ctrl.Result{}, nil
}
```
6. Now we need to make sure that the bootstrap data is available. This is provided by the **bootstrap provider** and essentially is what enables an empty host to turn into a kubernetes node:
```go
// Make sure bootstrap data is available and populated.
if machine.Spec.Bootstrap.DataSecretName == nil {
	if !util.IsControlPlaneMachine(machine) && !conditions.IsTrue(cluster, clusterv1.ControlPlaneInitializedCondition) {
		logger.Info("Waiting for the control plane to be initialized")
		return ctrl.Result{}, nil
	}

	logger.Info("Waiting for the Bootstrap provider controller to set bootstrap data")
	return ctrl.Result{}, nil
}
```
7. It's finally time to do the real work - get the node-to-be's role and create the Docker container if it doesn't exist:
```go
// Create the docker container hosting the machine
role := constants.WorkerNodeRoleValue
if util.IsControlPlaneMachine(machine) {
	role = constants.ControlPlaneNodeRoleValue
}

// Create the machine if not existing yet
if !externalMachine.Exists() {
	if err := externalMachine.Create(ctx, dockerMachine.Spec.CustomImage, role, machine.Spec.Version, docker.FailureDomainLabel(machine.Spec.FailureDomain), nil); err != nil {
		return ctrl.Result{}, errors.Wrap(err, "failed to create worker DockerMachine")
	}
}
```
8. If we just created a control plane node, we need to update the load balancer configuration to point to it
```go
// if the machine is a control plane update the load balancer configuration
// we should only do this once, as reconfiguration more or less ensures
// node ref setting fails
if util.IsControlPlaneMachine(machine) && !dockerMachine.Status.LoadBalancerConfigured {
	if err := externalLoadBalancer.UpdateConfiguration(ctx); err != nil {
		return ctrl.Result{}, errors.Wrap(err, "failed to update DockerCluster.loadbalancer configuration")
	}
	dockerMachine.Status.LoadBalancerConfigured = true
}
```
9. Now that we have a container up, we need to bootstrap it into a kubernetes node. This takes the bootstrap data (either in cloud-init or ignition format), converts it into a series of commands, and executes them in the container. Virtualizations and cloud platforms can generally just accept the bootstrap data upon VM creation and run it upon boot.
```go
// if the machine isn't bootstrapped, only then run bootstrap scripts
if !dockerMachine.Spec.Bootstrapped {
	timeoutCtx, cancel := context.WithTimeout(ctx, 3*time.Minute)
	defer cancel()
	if err := externalMachine.CheckForBootstrapSuccess(timeoutCtx, false); err != nil {
		bootstrapData, format, err := r.getBootstrapData(timeoutCtx, machine)
		if err != nil {
			logger.Error(err, "failed to get bootstrap data")
			return ctrl.Result{}, err
		}

		// Run the bootstrap script. Simulates cloud-init/Ignition.
		if err := externalMachine.ExecBootstrap(timeoutCtx, bootstrapData, format); err != nil {
			conditions.MarkFalse(dockerMachine, infrastructurev1alpha1.BootstrapExecSucceededCondition, infrastructurev1alpha1.BootstrapFailedReason, clusterv1.ConditionSeverityWarning, "Repeating bootstrap")
			return ctrl.Result{}, errors.Wrap(err, "failed to exec DockerMachine bootstrap")
		}
		// Check for bootstrap success
		if err := externalMachine.CheckForBootstrapSuccess(timeoutCtx, true); err != nil {
			conditions.MarkFalse(dockerMachine, infrastructurev1alpha1.BootstrapExecSucceededCondition, infrastructurev1alpha1.BootstrapFailedReason, clusterv1.ConditionSeverityWarning, "Repeating bootstrap")
			return ctrl.Result{}, errors.Wrap(err, "failed to check for existence of bootstrap success file at /run/cluster-api/bootstrap-success.complete")
		}
	}
	dockerMachine.Spec.Bootstrapped = true
}
```
Define **getBootstrapData** at the end of the file as follows:
```go
func (r *DockerMachineReconciler) getBootstrapData(ctx context.Context, machine *clusterv1.Machine) (string, bootstrapv1.Format, error) {
	if machine.Spec.Bootstrap.DataSecretName == nil {
		return "", "", errors.New("error retrieving bootstrap data: linked Machine's bootstrap.dataSecretName is nil")
	}

	s := &corev1.Secret{}
	key := client.ObjectKey{Namespace: machine.GetNamespace(), Name: *machine.Spec.Bootstrap.DataSecretName}
	if err := r.Client.Get(ctx, key, s); err != nil {
		return "", "", errors.Wrapf(err, "failed to retrieve bootstrap data secret for DockerMachine %s", klog.KObj(machine))
	}

	value, ok := s.Data["value"]
	if !ok {
		return "", "", errors.New("error retrieving bootstrap data: secret value key is missing")
	}

	format := s.Data["format"]
	if len(format) == 0 {
		format = []byte(bootstrapv1.CloudConfig)
	}

	return base64.StdEncoding.EncodeToString(value), bootstrapv1.Format(format), nil
}
```
10. Now report the node's IP addresses:
```go
	if err := setMachineAddress(ctx, dockerMachine, externalMachine); err != nil {
		logger.Error(err, "failed to set the machine address")
		return ctrl.Result{RequeueAfter: 5 * time.Second}, nil
	}
```
And define that function at the end of the file:
```go
// setMachineAddress gets the address from the container corresponding to a docker node and sets it on the Machine object.
func setMachineAddress(ctx context.Context, dockerMachine *infrastructurev1alpha1.DockerMachine, externalMachine *docker.Machine) error {
	machineAddress, err := externalMachine.Address(ctx)
	if err != nil {
		return err
	}

	dockerMachine.Status.Addresses = []clusterv1.MachineAddress{
		{
			Type:    clusterv1.MachineHostName,
			Address: externalMachine.ContainerName(),
		},
		{
			Type:    clusterv1.MachineInternalIP,
			Address: machineAddress,
		},
		{
			Type:    clusterv1.MachineExternalIP,
			Address: machineAddress,
		},
	}
	return nil
}
11. Now we need to set the ProviderID both in the spec of the `DockerMachine` and in the spec of the `Node` in the workload cluster. This is necessary because kubernetes will automatically approve the CSRs (certificate signing request) for new nodes only if these fields match. We add the following code to our **reconcileNormal** function:
```go
// Usually a cloud provider will do this, but there is no docker-cloud provider
remoteClient, err := r.Tracker.GetClient(ctx, client.ObjectKeyFromObject(cluster))
if err != nil {
	return ctrl.Result{}, errors.Wrap(err, "failed to generate workload cluster client")
}
if err := externalMachine.SetNodeProviderID(ctx, remoteClient); err != nil {
	if errors.As(err, &docker.ContainerNotRunningError{}) {
		return ctrl.Result{}, errors.Wrap(err, "failed to patch the Kubernetes node with the machine providerID")
	}
	logger.Error(err, "failed to patch the Kubernetes node with the machine providerID")
	return ctrl.Result{RequeueAfter: 5 * time.Second}, nil
}
// Set ProviderID so the Cluster API Machine Controller can pull it
providerID := externalMachine.ProviderID()
dockerMachine.Spec.ProviderID = &providerID
```
We also need to add code to **main.go** to initialize **r.Tracker**.  Add the import:
```go
"sigs.k8s.io/cluster-api/controllers/remote"
```
After initializing **runtimeClient**, add the following:
```go
log := ctrl.Log.WithName("remote").WithName("ClusterCacheTracker")
tracker, err := remote.NewClusterCacheTracker(
	mgr,
	remote.ClusterCacheTrackerOptions{
		Log:     &log,
		Indexes: remote.DefaultIndexes,
	},
)
if err != nil {
	setupLog.Error(err, "unable to create cluster cache tracker")
	os.Exit(1)
}

if err := (&remote.ClusterCacheReconciler{
	Client:  mgr.GetClient(),
	Tracker: tracker,
}).SetupWithManager(ctx, mgr, controller.Options{
	MaxConcurrentReconciles: 10,
}); err != nil {
	setupLog.Error(err, "unable to create controller", "controller", "ClusterCacheReconciler")
	os.Exit(1)
}
```
Modify the code that creates the **DockerMachineReconciler** to match this:
```go
if err = (&controllers.DockerMachineReconciler{
	Client:           mgr.GetClient(),
	ContainerRuntime: runtimeClient,
	Scheme:           mgr.GetScheme(),
	Tracker:          tracker,
}).SetupWithManager(mgr); err != nil {
	setupLog.Error(err, "unable to create controller", "controller", "DockerMachine")
	os.Exit(1)
}
```
12. Now that we're finally done, we can notify CAPI:
```go
dockerMachine.Status.Ready = true

return ctrl.Result{}, nil
```

### Implement delete reconciliation
The **reconcileDelete** function needs to undo what **reconcileNormal** did - mainly delete the container and remove the load balancer configuration:
1. Create the function shell:
```go
func (r *DockerMachineReconciler) reconcileDelete(ctx context.Context, cluster *clusterv1.Cluster, machine *clusterv1.Machine, dockerMachine *infrastructurev1alpha1.DockerMachine, externalMachine *docker.Machine, externalLoadBalancer *docker.LoadBalancer) (_ ctrl.Result, retErr error) {
	logger := log.FromContext(ctx)
}
```
2. Delete the container:
```go
// delete the machine
if err := externalMachine.Delete(ctx); err != nil {
	return ctrl.Result{}, errors.Wrap(err, "failed to delete DockerMachine")
}
```
3. Update the load balancer configuration:
```go
// if the deleted machine is a control-plane node, remove it from the load balancer configuration;
if util.IsControlPlaneMachine(machine) {
	if err := externalLoadBalancer.UpdateConfiguration(ctx); err != nil {
		return ctrl.Result{}, errors.Wrap(err, "failed to update DockerCluster.loadbalancer configuration")
	}
}
```
4. We're done, so delete the finalizer (so that the `DockerMachine` can be cleaned up) and return:
```go
// Machine is deleted so remove the finalizer.
controllerutil.RemoveFinalizer(dockerMachine, infrastructurev1alpha1.MachineFinalizer)
return ctrl.Result{}, nil
```

### Setup the controller

Copy the **SetupWithManager** function from [here](https://github.com/capi-samples/cluster-api-provider-docker/blob/main/controllers/dockermachine_controller.go), which is very similar to the corresponding function for **DockerCluster**.  You can see that this one is configured to watch `DockerMachine`s as well as their corresponding `Machine`s.

## Adding the DockerMachineTemplate Resource
When creating docker cluster via CAPI, users create the `Cluster` and `DockerCluster` directly, but they don't create `Machine`s and `DockerMachine`s.  Instead, users create a `MachineDeployment` and a corresponding `DockerMachineTemplate`.  When a `MachineDeployment` is scaled up, CAPI will create the requisite `Machine`s and `DockerMachine`s.  The `DockerMachine`s will be based on the provided `DockerMachineTemplate`.  The template generally has a copy of the infrustructure machine's Spec as its Spec.  A typical example is that infrastructure machines will have properties such as CPU cores, RAM, or a reference to an image.  The user would provide those properties in the template, which would be copied to each infrastructure machine.

The API can be created via kubebuilder. Note that The template has no corresponding controller, so answer "n" for the "Create Controller" prompt.  To save time in this tutorial, however, simply copy the file from [here](https://github.com/capi-samples/cluster-api-provider-docker/blob/main/api/v1alpha1/dockermachinetemplate_types.go).



Remember to generate code to reflect all of the above:
```shell
make manifests
make build
```
