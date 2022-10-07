# Building a Cluster API Provider

[![hackmd-github-sync-badge](https://hackmd.io/R3b2HacRQ2aoRQRGnaSy3Q/badge)](https://hackmd.io/R3b2HacRQ2aoRQRGnaSy3Q)


## Pre-reqs
- Go v1.18
- [Kubebuilder v3.6.0](https://github.com/kubernetes-sigs/kubebuilder/releases/tag/v3.6.0)
- Docker
- Tilt
- Kubectl
- Kustomize

> NOTE: we are not using v3.7.0 for Kubebuilder due to requiring Go 1.19 and also an issues with Apple M1 Silicon

## Introduction / theory

We will be creating a **infrastructure** provider for Docker as part of this tutorial

**** TODO

## Setup

**Objective:** To setup the repositories that are needed for this tutorial 

1. Fork the [Cluster API Repo](https://github.com/kubernetes-sigs/cluster-api)
2. Clone the forked **Cluster API** repo into your **GOPATH** (i.e. `~/go/src/sigs.k8s.io/cluster-api`)
3. Create a new repository called `cluster-api-provider-docker`
4. Clone your new repo into the **GOPATH** (i.e. `~/go/src/github.com/myname/cluster-api-provider-docker`)

> **Why clone into the GOPATH?** There have been historic issues with code generation tools when they are run outside the go path

5. Add the following to the `.gitignore` in your providers repo
    - **.vscode/**
    - **.tiltbuild/**
    - **bin/**

## Skafolding

**Objective:** To create the initial project structure for our provider. Learn about the skaffolding tooling. NOTE: these steps are applicable to any operator you want to build.

1. Open your favourite terminal and go to `cluster-api-provider-docker` direcrory.
2. Run the following commands to skaffold the project

```shell=
kubebuilder init --domain  cluster.x-k8s.io --repo github.com/capi-samples/cluster-api-provider-docker --project-version 3
```

3. Run the following commands to skaffold the API & controllers for the **DockerCluster** and **DockerMachine**, ensuring you answer **Y** to the following:
  a. Create Resource
  b. Create Controller
  
```shell!=
kubebuilder create api --group infrastructure --version v1alpha1 --kind DockerCluster
kubebuilder create api --group infrastructure --version v1alpha1 --kind DockerMachine
```

4. Run the following commands:

```shell
make generate
make manifests
make build
```

5. Take a look at the generated code:
   a. `api/v1alpha1` folder contains the CRD definitions for your infrastructsure cluster & machine
   b. `controllers` contains the controllers that will reconcile instances of your infrastructure CRDs
   c. `config` contains the Kubernetes artefacts that will be bundled together and used when deploying our provider
   
## Setting up Tilt

**Objective:** Learn how to setup `Tilt` to enable us to develop the provider in a rapid & interartive manor. Also learn how we can attach a debugger to the provider.

**Background:** Every CAPI provider has a `tilt-provider.json` in the root of its repo which is used by the upstream CAPI Tiltfile to tell it about your provider. This is used to configure hot reloading and the categorization within the tilt ui

1. Ensure **Tilt** and **kind** are installed
2. Create a new file in the root of your providers repo called `tilt-provider.json`.
3. Add the following contents to the file:

```json
[
    {
      "name": "docker-kubecon",
      "config": {
        "image": "ghcr.io/capi-samples/cluster-api-provider-docker:dev",
        "live_reload_deps": [
          "main.go",
          "go.mod",
          "go.sum",
          "api",
          "controllers",
          "pkg"
        ],
        "label": "CAPDKC"
      }
    }
]
```

4. Note the following from the content:
   1. **name** is the name of the provider you would use with `clusterctl` and whenconfiguring Tilt in CAPI
   2.   **image** is the name of the image that Tilt will look for modifying the kubernetes artefactes.
   3.   **live_reload_deps** is a list of files & folders that will be monitored for changes. If a change ocurs then Tilt will rebuild your provider and re-install it into the cluster
   4.   **label** is required for the Tilt UI
   5.   You can have more than 1 provider in a repo so this block could be repeated many times.

> NOTE: There are conventions that relate to the accroynm used for a CAPI provider.....**TODO

5. Edit the `config/default/kustomization.yaml` in your providers repo:
    1. Change the `namespace` to **capdkc-system**
    2. Change the `namePrefix` to **capdkc-**
    3. Uncomment and add a label to `commonLabels` called **cluster.x-k8s.io/provider** with a value of **"infrastructure-capdkc"**

6. Create the `config/default/manager_image_patch.yaml` file and add the following contents:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: controller-manager
  namespace: system
spec:
  template:
    spec:
      containers:
      - image: ghcr.io/capi-samples/cluster-api-provider-docker:dev
        name: manager
```

7. Edit `config/default/kustomization.yaml` and add `manager_image_patch.yaml` to the **patchesStrategicMerge**
8. Delete the `config/default/manager_auth_proxy_patch.yaml` and `config/default/manager_config_patch.yaml` files.
9. Edit `config/default/kustomization.yaml` and remove `manager_auth_proxy_patch.yaml` to the **patchesStrategicMerge**
10. Delete `config/manager/controller_manager_config.yaml`
11. Edit `config/manager/kustomization.yaml` so that its contents match:

```yaml
resources:
- manager.yaml
```

12. Replace the contents of `config/manager/manager.yaml` with the following:

> NOTE: we can change this and supply a link to the file in github instead

```yaml
apiVersion: v1
kind: Namespace
metadata:
  labels:
    control-plane: controller-manager
  name: system
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: controller-manager
  namespace: system
  labels:
    control-plane: controller-manager
spec:
  selector:
    matchLabels:
      control-plane: controller-manager
  replicas: 1
  template:
    metadata:
      labels:
        control-plane: controller-manager
    spec:
      containers:
      - args:
        - "--leader-elect"
        image: controller:latest
        name: manager
        env:
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: POD_UID
          valueFrom:
            fieldRef:
              fieldPath: metadata.uid
        ports:
        - containerPort: 9440
          name: healthz
          protocol: TCP
        readinessProbe:
          httpGet:
            path: /readyz
            port: healthz
        livenessProbe:
          httpGet:
            path: /healthz
            port: healthz
        volumeMounts:
          - mountPath: /var/run/docker.sock
            name: dockersock
        securityContext:
          privileged: true
      terminationGracePeriodSeconds: 10
      serviceAccountName: controller-manager
      tolerations:
      - effect: NoSchedule
        key: node-role.kubernetes.io/master
      - effect: NoSchedule
        key: node-role.kubernetes.io/control-plane
      volumes:
        - name: dockersock
          hostPath:
            path: /var/run/docker.sock

```
5. Create a `tilt-settings.json` file in the root of your forked/cloned `cluster-api` directory.
6. Add the following contents to the file:

```json
{
    "default_registry": "gcr.io/yourname",
    "provider_repos": ["../../github.com/capi-samples/cluster-api-provider-docker"],
    "enable_providers": ["docker-kubecon", "kubeadm-bootstrap", "kubeadm-control-plane"],
    "kustomize_substitutions": {
        "EXP_MACHINE_POOL": "true",
        "EXP_CLUSTER_RESOURCE_SET": "true"
    },
    "extra_args": {
        "docker-kubecon": ["-zap-log-level=debug"],
    },
    "debug": {
        "docker-kubecon": {
            "continue": true,
            "port": 30000
        }
    }
}
```
7. We will not cover every setting in this file (see docs for a full description) but note the following:
    1. **provider_repos**: contains the path to your clones providers repo
    2. **enable_providers**: this is where we say which providers we want installed in our local management cluster. We are using the **docker-kubecon** here for our provider and this matches the name in the `tilt-provider.json` file
    3. **debug**: we are saying that we want our provider to be started via delve and the debugger to listen on port **30000**.
8. Open another terminal (or pane) and go to the `cluster-api` directory.
9. Run the following command to create a local kind cluster:

```shell
kind create cluster --name=capi-test
```

10. Now start tilt by running the following:

```shell
tilt up
```

11. Press the **space** key to see the Tilt web ui and check that everything goes green. 

> You can click on **(Tiltfile)** to see all the resources.

**Congratulations you now have your provider running via Tilt. If you make any code changes you should see that your provider is automatically rebuilt**

### Debugging

**Objective:** Attach a debugger to the provider which is running via delve. 

**Background:** We will use VSCode as ana example but similar steps can be used for other IDEs such as Goland

1. Create the following file (if it doesn't exists) `.vscode/launch.json` in your providers repo
2. Add the following launch configuration to it:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Connect to docker provider",
            "type": "go",
            "request": "attach",
            "mode": "remote",
            "remotePath": "${workspaceFolder}",
            "port": 30000,
            "host": "127.0.0.1"
        }
    ]
}
```

3. Set any breakpoints (such as on the `Reconcile` functions) and then start the debugger in VSCode.

## Implementing the cluster api/controller


**TODO: Quick recap on the contract / responsilibility, then steps

1. Add a reference to the packages we need:

```shell
go get github.com/capi-samples/cluster-api-provider-docker/pkg
```

2. Edit `api/v1alpha1/dockercluster_types.go` and add a new field to allow overriding the default load balancer image:

```go
	// LoadBalancerImage allows you override the load balancer image. If not specified a
	// default image will be used.
	// +optional
	LoadBalancerImage string `json:"loadbalancerImage,omitempty"`
```

3. Update the generated code and manifests bu running:

```shell
make generate
make manifests
```

> You could also just run `make`

## Implementing the machine api/controller

**TODO: Quick recap on the contract / responsilibility, then steps

Find the Machine Infrastructure Provider contract [here](https://cluster-api.sigs.k8s.io/developer/providers/machine-infrastructure.html)

### Data Types
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

### Adding the DockerMachineTemplate Resource
1. Use kubebuilder to skaffold DockerMachineTemplate API (not really necessary to skaffold the controller as well) `kubebuilder create api --group infrastructure --version v1alpha1 --kind DockerMachineTemplate`
2. Modify the skaffolded code to include all required fields as per the CAPI contract and make sure to generate the manifests


### Writing the DockerMachine Reconciler
As simple as implementing this [flow diagram](https://cluster-api.sigs.k8s.io/developer/providers/machine-infrastructure.html#behavior) :smiley_cat: 

**TODO Add a note on Conditions in CAPI


## Testing

**TODO

## Releasing

**TODO




