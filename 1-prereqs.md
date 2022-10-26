# Pre-reqs

You will need to install the following to follow along with this tutorial:

- git
- make
- [Go v1.19](https://go.dev/dl/)
- [Kubebuilder v3.6.0](https://github.com/kubernetes-sigs/kubebuilder/releases/tag/v3.6.0)
- [Docker](https://docs.docker.com/get-docker/)
  - If you are using a Mac then please use Docker Desktop v4.12 or less. There is an issue with v4.13 due to a change to the socket location.
- [Tilt](https://docs.tilt.dev/install.html)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Kustomize](https://github.com/kubernetes-sigs/kustomize)
- [kind](https://kind.sigs.k8s.io/)
- [clusterctl](https://github.com/kubernetes-sigs/cluster-api/releases)

> NOTE: we are not using v3.7.0 for Kubebuilder due to an issue with Apple M1 Silicon

## System pre-reqs

Under the hood, we will use the kubeadm control plane provider and kubeadm bootstrap provider for bootstrapping a Kubernetes node. So it is recommended to have the same system requirements as kubeadm to avoid any `kubeadm init` or `kubeadm join` failures. For a detailed list of kubeadm pre-reqs, refer the official documentation [here](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin).

At the minimum,
- 2 GB or more of RAM per machine
- 2 CPUs or more