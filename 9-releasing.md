# Releasing

**Objective:** Setup a release pipeline and produce our first release.

- [Releasing](#releasing)
  - [Background](#background)
  - [Create metadata.yaml](#create-metadatayaml)
  - [Update the container build](#update-the-container-build)
  - [Create release GitHub Action](#create-release-github-action)
  - [Create out first release](#create-out-first-release)
  - [Testing our new release](#testing-our-new-release)

## Background

For your provider to be installable using **clusterctl** there are a number of requirements as a provider author that you must be aware of.

Firstly, you must create a file that clusterctl can use to know which version of your provider is compatible with which API versions. This file is called **metadata.yaml** and lives in your repo.

Secondly, your provider must be built into a container image that is available via a registry. This is normally a public registry (such as Docker Hub or GitHub Container Registry) but it is also possible to use a private registry.

Lastly, for each new version of your provider you will create a GitHub release. The name of the release will be the version number of your provider.

> You must use semver for versioning.

Each GitHub release is expected to have certain artifacts attached to it:

- **metadata.yaml**
- **infrastructure-components.yaml** - this is all the k8s artefacts required to install your provider
- **cluster-template-\*.yaml** - these are the cluster templates that users will be able to use with `clusterctl generate cluster`

## Create metadata.yaml

In this tutorial we will start our releases from **0.1.0**.

1. Create a new file in the root of your repo called **metadata.yaml**
2. Add the following contents to the new files:

```yaml
# maps release series of major.minor to cluster-api contract version
# the contract version may change between minor or major versions, but *not*
# between patch versions.
#
# update this file only when a new major or minor version is released
apiVersion: clusterctl.cluster.x-k8s.io/v1alpha3
releaseSeries:
  - major: 0
    minor: 1
    contract: v1beta1
```

> This is mapping the 0.1.x release series to the v1beta1 api contract of capi. You will need to update this file when you change the major or minor version number AND when there is a new version of CAPI API contract that your provider supports.

## Update the container build

The generated **Dockerfile** from the skaffolding stage uses Docker [multi-stage builds](https://docs.docker.com/build/building/multi-stage/).

1. Edit **Dockerfile**:
   1. change `FROM golang:1.18 as builder` to `FROM golang:1.19 as builder`
   2. add `COPY pkg/ pkg/` to the source code copying
   3. In the second stage (i.e. after `FROM gcr.io/distroless/static:nonroot`) add a label to associate the images with your repo: `LABEL org.opencontainers.image.source=https://github.com/capi-samples/cluster-api-provider-docker` (**Change the owner of the repo to your name**)
2. Edit **Makefile** change and  `IMG ?= controller:latest` to:

```make
TAG ?= dev
REGISTRY ?= ghcr.io
ORG ?= capi-samples
CONTROLLER_IMAGE_NAME := cluster-api-provider-docker
IMG ?= $(REGISTRY)/$(ORG)/$(CONTROLLER_IMAGE_NAME):$(TAG)
```

> Make sure you update the value of **ORG** to be your user name

3. Test your changes by opening a terminal in your providers directory and running:

```shell
make docker-build
```

4. You should see output similar to this:

```shell
Successfully built 6001e93da9c0
Successfully tagged ghcr.io/capi-samples/cluster-api-provider-docker:dev
```

## Create release GitHub Action

We will be using GitHub Actions and GitHub Container Registry to create our releases. But the steps could easily be done in any tool and registry of your choice.

1. Create the `.github/workflows` folders in your repo
2. Create a new file called **release.yml** in the new **workflows** folder
3. Unless specified the remainder of the steps are **additions** to **release.yml**
4. Start by naming the workflow:

```yaml
name: release
```

5. Next we define that we want the workflow to run when we push a new tag that follows sematic versioning:

```yaml
on:
  push:
    tags:
    - "v*.*.*"
```

6. For convenience we will define a couple of environment variables that we can use later on in the job & steps definitions:

```yaml
env:
  TAG: ${{ github.ref_name }}
  REGISTRY: ghcr.io
```

7. Define the release job which will run on **ubuntu** and require **write** access to to GitHub packages (to publish container images) and write access to the repo (to create releases):

```yaml
jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
    steps:
```

8. Next add a step to get the source for our provider:

```yaml
    - name: Checkout
      uses: actions/checkout@v2
      with:
        fetch-depth: 0
```

9. Next we will build the container image for our provider and push it to the GitHub container registry:

```yaml
    - name: Docker login
      uses: docker/login-action@v1
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    - name: Build docker image
      run: make docker-build TAG=${{ env.TAG }}
    - name: Push docker image
      run: make docker-push TAG=${{ env.TAG }}
```

10. Now we need to create the **infrastructure-components.yaml** file so that we can later attach it to the release:

```yaml
    - name: Update manifests
      run: |
        # this can be done via other means if required
        kustomize build config/default/ > infrastructure-components.yaml
        sed -i "s/cluster-api-provider-docker:dev/cluster-api-provider-docker:${TAG}/g" infrastructure-components.yaml
```

11. Create a new GitHub release using the tag as the name and attaching the required files mentioned in the [Background](#background) section:

```yaml
    - name: GitHub Release
      uses: softprops/action-gh-release@v1
      with:
        prerelease: false
        draft: true
        fail_on_unmatched_files: true
        generate_release_notes: true
        discussion_category_name: Announcements
        name: ${{ env.TAG }}
        files: |
          templates/cluster-template.yaml
          metadata.yaml
          infrastructure-components.yaml
```
12. Commit and push the changes to your repo

## Create out first release

> If you are bumping the MAJOR or MINOR version number you will need to change **metadata.yaml** first and commit this to your repo.

1. Open a terminal and go to your providers directory
2. Checkout main, get latest and pull tags:

```shell
git checkout main
git pull --tags
```

> You can get the last version using `git describe --tags --abbrev=0`

3. Create a variable with your release version and tag:

```shell
RELEASE_VERSION=v0.1.0
git tag -s "${RELEASE_VERSION}" -m "${RELEASE_VERSION}"
```

4. Push the new tag:

```shell
git push origin "${RELEASE_VERSION}"
```

5. Go to your repo in the browser and watch the **release** action. One it completes successfully continue on.
6. Go to the new **v0.1.0** and check that the assets have been attached and the release notes are ok.
7. Edit the release and then click **Publish Release**
8. Go to the root of your repo and click on the **cluster-api-provider-docker** package
9. By default the package will be public. We will make it public:
   1.  Click **Package settings**
   2.  Scroll down to the **Danger Zone** and click on **Change visibility**
   3.  Click public, enter the repo and confirm the changes 

## Testing our new release

1. Open a new terminal window
2. Tell clusterctl about our provider via the use of a local config file:

```shell
RELEASE_VERSION=v0.1.0

mkdir -p ~/.cluster-api

cat << EOF >>~/.cluster-api/clusterctl.yaml
providers:
  - name: "docker-kubecon"
    url: "https://github.com/capi-samples/cluster-api-provider-docker/releases/$RELEASE_VERSION/infrastructure-components.yaml"
    type: "InfrastructureProvider"
EOF
```

> Change the value of **RELEASE_VERSION** if needed and also make sure you use your GitHub name instead of **capi-samples**

3. Open a terminal and create a new cluster in kind:

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

kind create cluster --config kind-cluster-with-extramounts.yaml
```
4. Create a management cluster with our provider:

```shell
clusterctl init --infrastructure docker-kubecon
```

5. Use kubectl or k9s to see that your provider is installed
6. Create a new cluster using the template:

```shell
export KUBERNETES_VERSION=v1.22.0
export CLUSTER_NAME=kubecontest
export CONTROL_PLANE_MACHINE_COUNT=1
export WORKER_MACHINE_COUNT=1

clusterctl generate cluster -i docker-kubecon:$RELEASE_VERSION  $CLUSTER_NAME > cluster.yaml

kubectl apply -f cluster.yaml
```
