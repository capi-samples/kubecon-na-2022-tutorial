# Create a Cluster

**Objective:** Create a cluster template and use that to test creation of a cluster.

- [Create a Cluster](#create-a-cluster)
  - [Cluster Templates](#cluster-templates)
  - [Create the default template](#create-the-default-template)
  - [Generate the template](#generate-the-template)
  - [Deploy a cluster](#deploy-a-cluster)

## Cluster Templates

Providers can supply templates (a.k.a flavors) that can be used to generate the manifests for a cluster. Templates must be in the **templates** folder of your providers repo. The default template will be in a file called **cluster-template.yaml** but you can created different named templates by naming the file using this format **cluster-template-myname.yaml** where **myname** can be anything you choose and that part becomes the template name. In this section we will be creating the default template.

Templates can contain tokens, for example **${CLUSTER_NAME}**, and these tokens will be replaced by the value of an environment variable of the same name when you generate a clusters manifests using **clusterctl**. You also have the ability to set default values for a token should the environment variable not exist. 

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

## Generate the template

Now we have the template defined we can test it using clusterctl.

1. Open a new terminal and go to your provider's repo.
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

Let's save the cluster template for the next step.
```shell
clusterctl generate cluster kubecontest --from templates/cluster-template.yaml > cluster.yaml
```

## Deploy a cluster
It's time to deploy a cluster. Apply the command.
```bash
➜  kubectl apply -f cluster.yaml
cluster.cluster.x-k8s.io/kubecontest created
dockercluster.infrastructure.cluster.x-k8s.io/kubecontest created
kubeadmcontrolplane.controlplane.cluster.x-k8s.io/kubecontest-control-plane created
dockermachinetemplate.infrastructure.cluster.x-k8s.io/kubecontest-control-plane created
machinedeployment.cluster.x-k8s.io/kubecontest-md-0 created
dockermachinetemplate.infrastructure.cluster.x-k8s.io/kubecontest-md-0 created
kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/kubecontest-md-0 created
```

You can watch the status of cluster creation using `clusterctl describe cluster` command. The status will change as cluster creation progresses.
```bash
➜  clusterctl describe cluster kubecontest
NAME                                                            READY  SEVERITY  REASON                           SINCE  MESSAGE
Cluster/kubecontest                                             False  Warning   ScalingUp                        16s    Scaling up control plane to 1 replicas (actual 0)
├─ClusterInfrastructure - DockerCluster/kubecontest
├─ControlPlane - KubeadmControlPlane/kubecontest-control-plane  False  Warning   ScalingUp                        16s    Scaling up control plane to 1 replicas (actual 0)
│ └─Machine/kubecontest-control-plane-8pj4p                     False  Info      Bootstrapping                    11s    1 of 2 completed
└─Workers
  └─MachineDeployment/kubecontest-md-0                          False  Warning   WaitingForAvailableMachines      16s    Minimum availability requires 1 replicas, current 0 available
    └─Machine/kubecontest-md-0-67db999895-6nsnj                 False  Info      WaitingForControlPlaneAvailable  16s    0 of 2 completed
```

You can also get the info of each resource.
```bash
➜  kubectl get cluster
NAME          PHASE         AGE     VERSION
kubecontest   Provisioned   5m15s

➜  kubectl get dockercluster
NAME          CLUSTER       READY   ENDPOINT
kubecontest   kubecontest   true    {"host":"172.18.0.3","port":6443}

➜  kubectl get dockermachine
NAME                              CLUSTER       MACHINE                             PROVIDERID                                     READY
kubecontest-control-plane-plpgq   kubecontest   kubecontest-control-plane-8pj4p     docker:////kubecontest-control-plane-8pj4p     True
kubecontest-md-0-6rbbc            kubecontest   kubecontest-md-0-67db999895-6nsnj   docker:////kubecontest-md-0-67db999895-6nsnj   True
```

To get more detailed information about a specific resource, do the following. For example, if you want to see a control plane docker machine's detailed status
```yaml
➜  kubectl get dockermachine kubecontest-control-plane-plpgq -o yaml
apiVersion: infrastructure.cluster.x-k8s.io/v1alpha1
kind: DockerMachine
metadata:
  annotations:
    cluster.x-k8s.io/cloned-from-groupkind: DockerMachineTemplate.infrastructure.cluster.x-k8s.io
    cluster.x-k8s.io/cloned-from-name: kubecontest-control-plane
  finalizers:
  - dockermachine.infrastructure.cluster.x-k8s.io
  labels:
    cluster.x-k8s.io/cluster-name: kubecontest
    cluster.x-k8s.io/control-plane: ""
  name: kubecontest-control-plane-plpgq
  namespace: default
  ownerReferences:
  - apiVersion: controlplane.cluster.x-k8s.io/v1beta1
    kind: KubeadmControlPlane
    name: kubecontest-control-plane
    uid: 522117d4-d088-4618-9b7a-802eeee34841
  - apiVersion: cluster.x-k8s.io/v1beta1
    blockOwnerDeletion: true
    controller: true
    kind: Machine
    name: kubecontest-control-plane-8pj4p
    uid: 7cdc80cb-0f81-4216-a377-395d99d9e090
spec:
  bootstrapped: true
  providerID: docker:////kubecontest-control-plane-8pj4p
status:
  addresses:
  - address: kubecontest-control-plane-8pj4p
    type: Hostname
  - address: 172.18.0.4
    type: InternalIP
  - address: 172.18.0.4
    type: ExternalIP
  conditions:
  - lastTransitionTime: "2022-10-25T13:13:41Z"
    status: "True"
    type: Ready
  - lastTransitionTime: "2022-10-25T13:13:41Z"
    status: "True"
    type: BootstrapExecSucceeded
  - lastTransitionTime: "2022-10-25T13:13:24Z"
    status: "True"
    type: ContainerProvisioned
  loadBalancerConfigured: true
  ready: true
```

You can also see docker containers coming up. It shows the load balancer, `kubecontest-lb`, one control plane, `kubecontest-control-plane-xxx` and one worker machine, `kubecontest-md-xxx`.
```bash
➜  docker ps
CONTAINER ID   IMAGE                            COMMAND                  CREATED          STATUS          PORTS                                                                    NAMES
d7b31b6f4814   kindest/node:v1.23.0             "/usr/local/bin/entr…"   10 minutes ago   Up 10 minutes                                                                            kubecontest-md-0-67db999895-ghkxt
9fee27003748   kindest/node:v1.23.0             "/usr/local/bin/entr…"   11 minutes ago   Up 11 minutes   44591/tcp, 127.0.0.1:44591->6443/tcp                                     kubecontest-control-plane-8njhj
9318bd56bece   haproxytech/haproxy-alpine:2.4   "/docker-entrypoint.…"   16 minutes ago   Up 16 minutes   37579/tcp, 39827/tcp, 0.0.0.0:37579->6443/tcp, 0.0.0.0:39827->8404/tcp   kubecontest-lb
6d9cedd53689   kindest/node:v1.24.0             "/usr/local/bin/entr…"   6 days ago       Up 6 days       127.0.0.1:56641->6443/tcp                                                capi-test-control-plane
```

To understand what's happening, watch the controller logs (either in Tilt UI or by command line)
```bash
# docker controller log
kubectl logs -n capdkc-system capdkc-controller-manager-xxx

# capi controller log
kubectl logs -n capi-system capi-controller-manager-xxx

# kcp controller log
kubectl logs -n capi-kubeadm-control-plane-system capi-kubeadm-control-plane-controller-manager-xxx
```

Clean up (optional - whenever you want to delete the cluster)
```bash
kubectl delete cluster kubecontest
```

