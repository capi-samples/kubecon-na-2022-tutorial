# Setup

**Objective:** To setup the repositories that are needed for this tutorial.

1. Fork the [Cluster API Repo](https://github.com/kubernetes-sigs/cluster-api)
2. Clone the forked **Cluster API** repo into your **GOPATH** (i.e. `~/go/src/sigs.k8s.io/cluster-api`)
3. Create a new repository called `cluster-api-provider-docker`
4. Clone your new repo into the **GOPATH** (i.e. `~/go/src/github.com/myname/cluster-api-provider-docker`)

> **Why clone into the GOPATH?** There have been historic issues with code generation tools when they are run outside the go path

5. Add the following to the `.gitignore` in your providers repo
    - **.vscode/**
    - **.tiltbuild/**
    - **bin/**