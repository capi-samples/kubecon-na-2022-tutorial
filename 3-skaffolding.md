# Skafolding

**Objective:** To create the initial project structure for our provider. Learn about the skaffolding tooling. NOTE: these steps are applicable to any operator you want to build.

1. Open your favourite terminal and go to `cluster-api-provider-docker` directory.
2. Run the following commands to skaffold the project

```shell=
kubebuilder init --domain  cluster.x-k8s.io --repo github.com/myname/cluster-api-provider-docker --project-version 3
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
   a. `api/v1alpha1` folder contains the CRD definitions for your infrastructure cluster & machine
   b. `controllers` contains the controllers that will reconcile instances of your infrastructure CRDs
   c. `config` contains the Kubernetes artefacts that will be bundled together and used when deploying our provider
