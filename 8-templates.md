# Cluster Templates

**Objective:** Create a cluster template and use that to test creation of a cluster.

- [Cluster Templates](#cluster-templates)
  - [Background](#background)
  - [Create the default template](#create-the-default-template)
  - [Test the template](#test-the-template)

## Background

Providers can supply templates (a.k.a flavors) that can be used to generate the manifests for a cluster. Templates must be in the **templates** folder of your providers repo. The default template will be in a file called **cluster-template.yaml** but you can created different named templates by naming the file using this format **cluster-template-myname.yaml** where **myname** can be anything you choose and that part becomes the template name. In this section we will be creating the default template.

Templates can contain contains, for example **${CLUSTER_NAME}**, and these tokens will be replaced by the value of an environment variable of the same name when you generate a clusters manifests using **clusterctl**. You also have the ability to set default values for a token should the environment variable not exist. 

CAPI uses a [specific version of envsubst](https://github.com/a8m/envsubst) internally and not the version you find on most linux systems.

> You could also use **ClusterClass** to define a cluster template and then just change the required fields on a per cluster basis. This tutorial doesn't cover ClusterClass, so if you want to learn more please see the [docs](https://cluster-api.sigs.k8s.io/tasks/experimental-features/cluster-class/index.html).

## Create the default template

1. Create a folder called **templates** in the root of your repo.
2. Create a file called **cluster-template.yaml** in the **templates** folder

> If you don't want to follow the individual steps in this section you can copy the contents of the template from [here](https://github.com/capi-samples/cluster-api-provider-docker/blob/main/templates/cluster-template.yaml) into your new **cluster-template.yaml** file.

3. Add following steps will relate to adding to the new **cluster-template.yaml** file
4. Add the definition for the root CAPI **Cluster**:

```yaml
---
apiVersion: cluster.x-k8s.io/v1beta1
kind: Cluster
metadata:
  name: "${CLUSTER_NAME}"
spec:
  clusterNetwork:
    pods:
      cidrBlocks:
        - ${POD_CIDR:=172.25.0.0/16}
    services:
      cidrBlocks:
        - ${SERVICES_CIDR:=172.26.0.0/16}
  infrastructureRef:
    apiVersion: infrastructure.cluster.x-k8s.io/v1alpha1
    kind: DockerCluster
    name: "${CLUSTER_NAME}"
  controlPlaneRef:
    kind: KubeadmControlPlane
    apiVersion: controlplane.cluster.x-k8s.io/v1beta1
    name: "${CLUSTER_NAME}-control-plane"
```

> The **Cluster** is the root and it will eventually own (via `ownerReference`) all the other resource kins.

> In this example you will see the use of a default value for a token: `${POD_CIDR:=172.25.0.0/16}`. If there is no environment variable called **POD_CIDR** then the default value of **172.25.0.0/16** will be used. A list of the token options can be found [here](https://github.com/a8m/envsubst#docs).

5. Now add our infrastructure specific representation of a cluster (i.er **DockerCluster**):

```yaml
---
apiVersion: infrastructure.cluster.x-k8s.io/v1alpha1
kind: DockerCluster
metadata:
  name: "${CLUSTER_NAME}"
spec: {}
```

6. To bootstrap the control plane nodes we will use the Kubeadm control plane provider (a.k.a **KCP**):

```yaml
---
kind: KubeadmControlPlane
apiVersion: controlplane.cluster.x-k8s.io/v1beta1
metadata:
  name: "${CLUSTER_NAME}-control-plane"
spec:
  replicas: ${CONTROL_PLANE_MACHINE_COUNT}
  version: "${KUBERNETES_VERSION:=v1.23.0}"
  machineTemplate:
    infrastructureRef:
      kind: DockerMachineTemplate
      apiVersion: infrastructure.cluster.x-k8s.io/v1alpha1
      name: "${CLUSTER_NAME}-control-plane"
  kubeadmConfigSpec:
    initConfiguration:
        nodeRegistration:
            # We have to set the criSocket to containerd as kubeadm defaults to docker runtime if both containerd and docker sockets are found
            criSocket: unix:///var/run/containerd/containerd.sock
            kubeletExtraArgs:
              cgroup-driver: cgroupfs
              eviction-hard: nodefs.available<0%,nodefs.inodesFree<0%,imagefs.available<0%
    clusterConfiguration:
        controllerManager:
            extraArgs: { enable-hostpath-provisioner: 'true' }
    joinConfiguration:
        nodeRegistration:
            # We have to set the criSocket to containerd as kubeadm defaults to docker runtime if both containerd and docker sockets are found
            criSocket: unix:///var/run/containerd/containerd.sock
            kubeletExtraArgs:
              cgroup-driver: cgroupfs
              eviction-hard: nodefs.available<0%,nodefs.inodesFree<0%,imagefs.available<0%
```

7. In our KCP definition there is a reference to an infrastructure specific machine template (i.e. **DockerMachineTemplate**) that will be used by KCP to create **DockerMachine** for our control planes. So we need to add this template:

```yaml
---
kind: DockerMachineTemplate
apiVersion: infrastructure.cluster.x-k8s.io/v1alpha1
metadata:
  name: "${CLUSTER_NAME}-control-plane"
spec:
  template:
    spec: {}
```

8. The cluster and control plane have now been defined. Lets all a **MachineDeployment** for our clusters worker nodes:

```yaml
---
apiVersion: cluster.x-k8s.io/v1beta1
kind: MachineDeployment
metadata:
  name: "${CLUSTER_NAME}-md-0"
spec:
  clusterName: "${CLUSTER_NAME}"
  replicas: ${WORKER_MACHINE_COUNT}
  selector:
    matchLabels:
  template:
    spec:
      clusterName: "${CLUSTER_NAME}"
      version: "${KUBERNETES_VERSION:=v1.23.0}"
      bootstrap:
        configRef:
          name: "${CLUSTER_NAME}-md-0"
          apiVersion: bootstrap.cluster.x-k8s.io/v1beta1
          kind: KubeadmConfigTemplate
      infrastructureRef:
        name: "${CLUSTER_NAME}-md-0"
        apiVersion: infrastructure.cluster.x-k8s.io/v1alpha1
        kind: DockerMachineTemplate
```

9. A bit like the KCP definition the **MachineDeployment** holds a reference to the machine template to use for creating worker machines. Lets add that:

```yaml
---
apiVersion: infrastructure.cluster.x-k8s.io/v1alpha1
kind: DockerMachineTemplate
metadata:
  name: "${CLUSTER_NAME}-md-0"
spec:
  template:
    spec: {}
```

10. The **MachineDeployment** also contained a reference to the bootstrap provider to use when bootstrapping kubernetes on the infrastructure machines. The bootstrap provider normally matches the control plance provider, so in our case we need to use the Kubeadm bootstrap provider (a.k.a **CAPBK**):

```yaml
---
apiVersion: bootstrap.cluster.x-k8s.io/v1beta1
kind: KubeadmConfigTemplate
metadata:
  name: "${CLUSTER_NAME}-md-0"
spec:
  template:
    spec:
      joinConfiguration:
        nodeRegistration:
          # We have to set the criSocket to containerd as kubeadm defaults to docker runtime if both containerd and docker sockets are found
          criSocket: unix:///var/run/containerd/containerd.sock
          kubeletExtraArgs:
            cgroup-driver: cgroupfs
            eviction-hard: nodefs.available<0%,nodefs.inodesFree<0%,imagefs.available<0%
```

## Test the template

Now we have the template defined we can test it using clusterctl.

1. Open a new terminal and go to your providers repo.
2. Create environment variables with values for all the tokens in the template (that don't have a default values):

```shell
export KUBERNETES_VERSION=v1.23.0
export CLUSTER_NAME=kubecontest
export CONTROL_PLANE_MACHINE_COUNT=1
export WORKER_MACHINE_COUNT=1
```

3. Use **clusterctl** to generate the cluster definition:

```shell
clusterctl generate cluster kubecontest --from templates/cluster-template.yaml
```

> This will output the generated cluster definition to stdout. You should see no tokens in the definition.

> If you have the kind cluster / tilt still running you can validate this template against the CRDs by saving to a file and running `kubectl apply -f cluster.yaml --dry-run=server`
