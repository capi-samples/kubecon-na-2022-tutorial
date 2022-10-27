# Setting up Tilt

**Objective:** Learn how to setup `Tilt` to enable us to develop the provider in a rapid & iterative manner. Also learn how we can attach a debugger to the provider.

- [Setting up Tilt](#setting-up-tilt)
  - [Debugging](#debugging)

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
   1.   **name** is the name of the provider you would use with `clusterctl` and when configuring Tilt in CAPI
   2.   **image** is the name of the image that Tilt will look for modifying the kubernetes artifacts.
   3.   **live_reload_deps** is a list of files & folders that will be monitored for changes. If a change occurs then Tilt will rebuild your provider and re-install it into the cluster
   4.   **label** is required for the Tilt UI
   5.   You can have more than 1 provider in a repo so this block could be repeated many times.

> NOTE: There are conventions that relate to the acronym used for a CAPI provider. Infrastructure providers start with **CAP** and then a one or more characters (but not **BP**), for example CAPA for the AWS provider, CAPZ for the Azure provider. A bootstrap provider starts with **CAPBP** and then one or characters, for example CAPBPK for the Kubeadm bootstrap provider.

5. Edit the `config/default/kustomization.yaml` in your provider repo:
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

7. Edit `config/default/kustomization.yaml` and add `manager_image_patch.yaml` to **patchesStrategicMerge**
8. Delete the `config/default/manager_auth_proxy_patch.yaml` and `config/default/manager_config_patch.yaml` files.
9. Edit `config/default/kustomization.yaml` and remove `manager_auth_proxy_patch.yaml` from **patchesStrategicMerge**
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
13. To enable CAPI to perform conversion of object references we must state what versions of CAPI matches our providers. This is done using a label on the CRDS.
    1. Open `config/crd/kustomization.yaml`
    2. Add the following after the **resources** section:
    ```go
    commonLabels:
      cluster.x-k8s.io/v1beta1: v1alpha1
    ```
    > See the [provider contract](https://cluster-api.sigs.k8s.io/developer/providers/contracts.html#api-version-labels) for more details
14.  Create a `tilt-settings.json` file in the root of your forked/cloned `cluster-api` directory.
15.  Add the following contents to the file (replace "yourname" with your github account name):

```json
{
    "default_registry": "gcr.io/yourname",
    "provider_repos": ["../../github.com/yourname/cluster-api-provider-docker"],
    "enable_providers": ["docker-kubecon", "kubeadm-bootstrap", "kubeadm-control-plane"],
    "kustomize_substitutions": {
        "EXP_MACHINE_POOL": "true",
        "EXP_CLUSTER_RESOURCE_SET": "true"
    },
    "extra_args": {
        "docker-kubecon": ["-zap-log-level=debug"]
    },
    "debug": {
        "docker-kubecon": {
            "continue": true,
            "port": 31000
        }
    }
}
```
16. We will not cover every setting in this file (see [Cluster API doc](https://cluster-api.sigs.k8s.io/developer/tilt.html#tilt-settings-fields) for more info) but note the following:
    1. **provider_repos**: contains the path to your clones providers repo
    2. **enable_providers**: this is where we say which providers we want installed in our local management cluster. We are using the **docker-kubecon** here for our provider and this matches the name in the `tilt-provider.json` file
    3. **debug**: we are saying that we want our provider to be started via delve and the debugger to listen on port **30000**.
17. Open another terminal (or pane) and go to the `cluster-api` directory.
18. Run the following to create a configuration for kind:

```shell
cat > kind-cluster-with-extramounts.yaml <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: capi-test
nodes:
- role: control-plane
  extraMounts:
    - hostPath: /var/run/docker.sock
      containerPath: /var/run/docker.sock
EOF
```

> NOTE: if you are using Docker Desktop v4.13 or above then you will you will encounter issues from here. Until a permanent solution is found its recommended you use v4.12

19.  Run the following command to create a local kind cluster:

```shell
kind create cluster --config kind-cluster-with-extramounts.yaml
```

20. Now start tilt by running the following:

```shell
tilt up
```

21. Press the **space** key to see the Tilt web ui and check that everything goes green.

> You can click on **(Tiltfile)** to see all the resources.

**Congratulations you now have your provider running via Tilt. If you make any code changes you should see that your provider is automatically rebuilt**

## Debugging

**Objective:** Attach a debugger to the provider which is running via delve.

**Background:** We will use VSCode as an example but similar steps can be used for other IDEs such as Goland

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
            "port": 31000,
            "host": "127.0.0.1"
        }
    ]
}
```

3. Set any breakpoints (such as on the `Reconcile` functions) and then start the debugger in VSCode.
