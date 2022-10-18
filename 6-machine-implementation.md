# Implementing the machine api/controller

**TODO: Quick recap on the contract / responsibility, then steps

Find the Machine Infrastructure Provider contract [here](https://cluster-api.sigs.k8s.io/developer/providers/machine-infrastructure.html)

## Data Types
**Note:** The provider that we will write will contain **only** the required specs.

Comparing the CAPI Spec to our [dockermachine_types.go](https://github.com/capi-samples/cluster-api-provider-docker/blob/main/api/v1alpha1/dockermachine_types.go)

1. The skaffolded `DockerMachineSpec` comes with a sample Foo field. We will remove this and add the `providerID` field to this struct as per CAPI contract
2. The `DockerMachineStatus` struct is pretty empty at this point, we will add the `Ready` field to this struct. This indicates the *readiness* of the provider infrastructure
3. Also add `Conditions` field to `DockerMachineStatus` to represent the overall state of the component


Additional changes:

1. To add Conditions field, we will use cluster-api's v1beta1 Conditions API. So add the cluster-api dependency to your go.mod `require sigs.k8s.io/cluster-api v1.2.2`. Run `go mod tidy` if necessary
2. After making any change to our provider APIs, it is necessary to run `make run`. This will generate all the `manifests` (webhooks, roles, CRDs) in the `config` directory and also generate code containing `DeepCopy`, `DeepCopyInto` and `DeepCopyObject` implementations
3. Add a new **Mount** type to `api/v1alpha1/dockermachine_types.go`:

> TOOD: check if we can remove thsi type and corresponding stuff in the docker package

```go
// Mount specifies a host volume to mount into a container.
// This is a simplified version of kind v1alpha4.Mount types.
type Mount struct {
	// Path of the mount within the container.
	ContainerPath string `json:"containerPath,omitempty"`

	// Path of the mount on the host. If the hostPath doesn't exist, then runtimes
	// should report error. If the hostpath is a symbolic link, runtimes should
	// follow the symlink and mount the real destination to container.
	HostPath string `json:"hostPath,omitempty"`

	// If set, the mount is read-only.
	// +optional
	Readonly bool `json:"readOnly,omitempty"`
}
```
## Adding the DockerMachineTemplate Resource
1. Use kubebuilder to skaffold DockerMachineTemplate API (not really necessary to skaffold the controller as well) `kubebuilder create api --group infrastructure --version v1alpha1 --kind DockerMachineTemplate`
2. Modify the skaffolded code to include all required fields as per the CAPI contract and make sure to generate the manifests

## Writing the DockerMachine Reconciler
As simple as implementing this [flow diagram](https://cluster-api.sigs.k8s.io/developer/providers/machine-infrastructure.html#behavior) :smiley_cat: 

**TODO Add a note on Conditions in CAPI
