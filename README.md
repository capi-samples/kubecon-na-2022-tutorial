# Building a Cluster API Provider

[![hackmd-github-sync-badge](https://hackmd.io/R3b2HacRQ2aoRQRGnaSy3Q/badge)](https://hackmd.io/R3b2HacRQ2aoRQRGnaSy3Q)


## Pre-reqs
- [Kubebuilder v3.6.0](https://github.com/kubernetes-sigs/kubebuilder/releases/tag/v3.6.0)
- Docker
- Tilt
- Kubectl
- Kustomize

> NOTE: we are not using v3.7.0 for Kubebuilder due to requiring Go 1.19 and also an issues with Apple M1 Silicon

## Introduction / theory

We will be creating a **infrastructure** provider for Docker as part of this tutorial

**** TODO

## Skafolding

1. Create a new repository called `cluster-api-provider-docker`
2. Clone repo into your GOPATH and chage directory to it

> historic issues with code generation tools outside the go path

3. Run the following commands to skaffold the project

```shell=
kubebuilder init --domain  cluster.x-k8s.io --repo github.com/capi-samples/cluster-api-provider-docker --project-version 3
```

4. Run the following commands to skaffold the API & controllers for the **DockerCluster** and **DockerMachine**, ensuring you answer **Y** to the following:
  a. Create Resource
  b. Create Controller
  
```shell!=
kubebuilder create api --group infrastructure --version v1alpha1 --kind DockerCluster
kubebuilder create api --group infrastructure --version v1alpha1 --kind DockerMachine
```

5. Take a look at the generated code:
   a. `api/v1alpha1` folder contains the CRD definitions for your infrastructsure cluster & machine
   b. `controllers` contains the controllers that will reconcile instances of your infrastructure CRDs
   c. `config` contains the Kubernetes artefacts that will be bundled together and used when deploying our provider
   
## Setting up Tilt

Before we start our implementation we will setup Tilt so that we can take advtange of the rapid interative development that it offers....

**TODO:
   
## Implementing the cluster api/controller


**TODO: Quick recap on the contract / responsilibility, then steps

## Implementing the machine api/controller

**TODO: Quick recap on the contract / responsilibility, then steps

## Testing

**TODO

## Releasing

**TODO




