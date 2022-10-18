# Adding webhooks

## Background
Admission webhooks are HTTP callbacks that receive admission requests, process them and return admission responses.

Kubernetes provides the following types of admission webhooks:
* Mutating Admission Webhook
  * These can mutate the object while it’s being created or updated, before it gets stored. 
  * It can be used to default fields in a resource requests, e.g. fields in Deployment that are not specified by the user. It can be used to inject sidecar containers.
* Validating Admission Webhook
  * These can validate the object while it’s being created or updated, before it gets stored. 
  * It allows more complex validation than pure schema-based validation. e.g. cross-field validation and pod image whitelisting.

If you want to implement admission webhooks for your CRD, the only thing you need to do is to implement the Defaulter and (or) the Validator interface.

Kubebuilder takes care of the following.
* Creating the webhook server.
* Ensuring the server has been added in the manager.
* Creating handlers for your webhooks.
* Registering each handler with a path in your server.

---
## Instructions
### Pre-req - Check Cert manager installation
We use cert manager to provision the certificates for the webhook server. If you have followed the Tilt instruction in `4-setup-tilt.md`, cert-manager should be deployed already.

Check if the cert-manager is deployed.
```bash
➜  kubectl get po -n cert-manager
NAME                                       READY   STATUS    RESTARTS        AGE
cert-manager-5dd59d9d9b-vf4wb              1/1     Running   1 (2d19h ago)   3d18h
cert-manager-cainjector-8696fc9f89-bjscf   1/1     Running   2 (2d19h ago)   3d18h
cert-manager-webhook-7d4b5b8c56-4mqfz      1/1     Running   2 (2d19h ago)   3d18h
```

### Implement defaulting/validating webhooks
Run the following commands to scaffold webhooks for `DockerCluster`. Run with the `--defaulting` and `--programmatic-validation` flags to use defaulting and validating webhooks.
```bash
kubebuilder create webhook --group infrastructure --version v1alpha1 --kind DockerCluster --defaulting --programmatic-validation
```

This will scaffold the webhook functions and register your webhook with the manager in your `main.go` for you.

Review the newly generated file, `api/v1alpha1/dockercluster_webhook.go`
```go
var dockerclusterlog = logf.Log.WithName("dockercluster-resource")

func (r *DockerCluster) SetupWebhookWithManager(mgr ctrl.Manager) error {
	return ctrl.NewWebhookManagedBy(mgr).
		For(r).
		Complete()
}
...
```

Notice that kubebuilder markers were added to generate webhook manifests.

This marker is responsible for generating a mutating webhook manifest.
```go
//+kubebuilder:webhook:path=/mutate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster,mutating=true,failurePolicy=fail,sideEffects=None,groups=infrastructure.cluster.x-k8s.io,resources=dockerclusters,verbs=create;update,versions=v1alpha1,name=mdockercluster.kb.io,admissionReviewVersions=v1
```

This marker is responsible for generating a validating webhook manifest.
```go
//+kubebuilder:webhook:path=/validate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster,mutating=false,failurePolicy=fail,sideEffects=None,groups=infrastructure.cluster.x-k8s.io,resources=dockerclusters,verbs=create;update,versions=v1alpha1,name=vdockercluster.kb.io,admissionReviewVersions=v1
```

If `webhook.Validator` interface is implemented, a webhook will automatically be served that calls the validation.
The `ValidateCreate`, `ValidateUpdate` and `ValidateDelete` methods are expected to validate its receiver upon creation, update and deletion respectively. 
```go
var _ webhook.Validator = &DockerCluster{}

// ValidateCreate implements webhook.Validator so a webhook will be registered for the type
func (r *DockerCluster) ValidateCreate() error {
	...
}

// ValidateUpdate implements webhook.Validator so a webhook will be registered for the type
func (r *DockerCluster) ValidateUpdate(old runtime.Object) error {
	...
}

// ValidateDelete implements webhook.Validator so a webhook will be registered for the type
func (r *DockerCluster) ValidateDelete() error {
	...
}
```

### Enable webhook and cert-manager
We need to update kustomization files in `config/` to enable webhook and cert-manager.

config/crd/kustomization.yaml
```yaml
- patches/cainjection_in_dockerclusters.yaml # ⬅️ uncomment
#- patches/cainjection_in_dockermachines.yaml
#- patches/cainjection_in_dockermachinetemplates.yaml
#+kubebuilder:scaffold:crdkustomizecainjectionpatch
```

config/default/kustomization.yaml
```yaml
bases:
- ../webhook # ⬅️ uncomment
- ../certmanager # ⬅️ uncomment

patchesStrategicMerge:
- manager_webhook_patch.yaml # ⬅️ uncomment
- webhookcainjection_patch.yaml # ⬅️ uncomment

# the following config is for teaching kustomize how to do var substitution
vars: # ⬅️ uncomment the entire section
- name: CERTIFICATE_NAMESPACE # namespace of the certificate CR
  objref:
    kind: Certificate
    group: cert-manager.io
    version: v1
    name: serving-cert # this name should match the one in certificate.yaml
  fieldref:
    fieldpath: metadata.namespace
- name: CERTIFICATE_NAME
  objref:
    kind: Certificate
    group: cert-manager.io
    version: v1
    name: serving-cert # this name should match the one in certificate.yaml
- name: SERVICE_NAMESPACE # namespace of the service
  objref:
    kind: Service
    version: v1
    name: webhook-service
  fieldref:
    fieldpath: metadata.namespace
- name: SERVICE_NAME
  objref:
    kind: Service
    version: v1
    name: webhook-service
```

### Generate webhook manifests
Run the following command.
```bash
➜  make manifests
```

Check and see `config/webhook/manifests.yaml` is generated. The file should contain `MutatingWebhookConfiguration` and `ValidatingWebhookConfiguration`.
```yaml
---
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
metadata:
  name: mutating-webhook-configuration
webhooks:
- admissionReviewVersions:
  - v1
  clientConfig:
    service:
      name: webhook-service
      namespace: system
      path: /mutate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster
      ...
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: validating-webhook-configuration
webhooks:
- admissionReviewVersions:
  - v1
  clientConfig:
    service:
      name: webhook-service
      namespace: system
      path: /validate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster
      ...
```

### Deploy Webhooks
Wait for `capdkc-controller` to be redeployed by Tilt
* If nothing happens, click the button next to `capdkc_controller` icon to manually trigger it.

See `capdkc-controller` log to confirm that webhooks are successfully deployed.
```bash
➜  kubectl logs -n capdkc-system capdkc-controller-manager-6bb95c6584-5xqmk -f
1.665938630520821e+09	INFO	controller-runtime.metrics	Metrics server is starting to listen	{"addr": ":8080"}
1.6659386305210242e+09	INFO	controller-runtime.builder	Registering a mutating webhook	{"GVK": "infrastructure.cluster.x-k8s.io/v1alpha1, Kind=DockerCluster", "path": "/mutate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster"}
1.665938630521065e+09	INFO	controller-runtime.webhook	Registering webhook	{"path": "/mutate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster"}
1.6659386305211687e+09	INFO	controller-runtime.builder	Registering a validating webhook	{"GVK": "infrastructure.cluster.x-k8s.io/v1alpha1, Kind=DockerCluster", "path": "/validate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster"}
1.665938630521209e+09	INFO	controller-runtime.webhook	Registering webhook	{"path": "/validate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster"}
1.6659386305212412e+09	INFO	setup	starting manager
1.6659386305218532e+09	INFO	controller-runtime.webhook.webhooks	Starting webhook server
1.6659386305219975e+09	INFO	Starting server	{"path": "/metrics", "kind": "metrics", "addr": "[::]:8080"}
1.6659386305220084e+09	INFO	Starting server	{"kind": "health probe", "addr": "[::]:8081"}
I1016 16:43:50.522478      11 leaderelection.go:248] attempting to acquire leader lease capdkc-system/c9b04f86.cluster.x-k8s.io...
1.6659386305240173e+09	INFO	controller-runtime.certwatcher	Updated current TLS certificate
1.6659386305244877e+09	INFO	controller-runtime.webhook	Serving webhook server	{"host": "", "port": 9443}
1.6659386305257964e+09	INFO	controller-runtime.certwatcher	Starting certificate watcher
I1016 16:44:06.032008      11 leaderelection.go:258] successfully acquired lease capdkc-system/c9b04f86.cluster.x-k8s.io
```

---
## Resource
* [Dynamic Admission Control](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/)
* [Implementing defaulting/validating webhooks](https://book.kubebuilder.io/cronjob-tutorial/webhook-implementation.html)