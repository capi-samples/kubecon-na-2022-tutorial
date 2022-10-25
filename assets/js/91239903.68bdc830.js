"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[824],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),i=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=i(e.components);return a.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,c=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=i(n),d=r,k=m["".concat(c,".").concat(d)]||m[d]||p[d]||l;return n?a.createElement(k,o(o({ref:t},u),{},{components:n})):a.createElement(k,o({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=m;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var i=2;i<l;i++)o[i]=n[i];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},9610:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>p,frontMatter:()=>l,metadata:()=>s,toc:()=>i});var a=n(7462),r=(n(7294),n(3905));const l={},o="Create a Cluster",s={unversionedId:"create-cluster",id:"create-cluster",title:"Create a Cluster",description:"Objective: Create a cluster template and use that to test creation of a cluster.",source:"@site/docs/8-create-cluster.md",sourceDirName:".",slug:"/create-cluster",permalink:"/kubecon-na-2022-tutorial/docs/create-cluster",draft:!1,editUrl:"https://github.com/capi-samples/kubecon-na-2022-tutorial/docs/8-create-cluster.md",tags:[],version:"current",sidebarPosition:8,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Adding webhooks",permalink:"/kubecon-na-2022-tutorial/docs/webhooks"},next:{title:"Testing",permalink:"/kubecon-na-2022-tutorial/docs/testing"}},c={},i=[{value:"Cluster Templates",id:"cluster-templates",level:2},{value:"Create the default template",id:"create-the-default-template",level:2},{value:"Generate the template",id:"generate-the-template",level:2},{value:"Deploy a cluster",id:"deploy-a-cluster",level:2}],u={toc:i};function p(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"create-a-cluster"},"Create a Cluster"),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Objective:")," Create a cluster template and use that to test creation of a cluster."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#create-a-cluster"},"Create a Cluster"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#cluster-templates"},"Cluster Templates")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#create-the-default-template"},"Create the default template")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#generate-the-template"},"Generate the template")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#deploy-a-cluster"},"Deploy a cluster"))))),(0,r.kt)("h2",{id:"cluster-templates"},"Cluster Templates"),(0,r.kt)("p",null,"Providers can supply templates (a.k.a flavors) that can be used to generate the manifests for a cluster. Templates must be in the ",(0,r.kt)("strong",{parentName:"p"},"templates")," folder of your providers repo. The default template will be in a file called ",(0,r.kt)("strong",{parentName:"p"},"cluster-template.yaml")," but you can created different named templates by naming the file using this format ",(0,r.kt)("strong",{parentName:"p"},"cluster-template-myname.yaml")," where ",(0,r.kt)("strong",{parentName:"p"},"myname")," can be anything you choose and that part becomes the template name. In this section we will be creating the default template."),(0,r.kt)("p",null,"Templates can contain tokens, for example ",(0,r.kt)("strong",{parentName:"p"},"${CLUSTER_NAME}"),", and these tokens will be replaced by the value of an environment variable of the same name when you generate a clusters manifests using ",(0,r.kt)("strong",{parentName:"p"},"clusterctl"),". You also have the ability to set default values for a token should the environment variable not exist. "),(0,r.kt)("p",null,"CAPI uses a ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/a8m/envsubst"},"specific version of envsubst")," internally and not the version you find on most linux systems."),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"You could also use ",(0,r.kt)("strong",{parentName:"p"},"ClusterClass")," to define a cluster template and then just change the required fields on a per cluster basis. This tutorial doesn't cover ClusterClass, so if you want to learn more please see the ",(0,r.kt)("a",{parentName:"p",href:"https://cluster-api.sigs.k8s.io/tasks/experimental-features/cluster-class/index.html"},"docs"),".")),(0,r.kt)("h2",{id:"create-the-default-template"},"Create the default template"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Create a folder called ",(0,r.kt)("strong",{parentName:"li"},"templates")," in the root of your repo."),(0,r.kt)("li",{parentName:"ol"},"Create a file called ",(0,r.kt)("strong",{parentName:"li"},"cluster-template.yaml")," in the ",(0,r.kt)("strong",{parentName:"li"},"templates")," folder")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"If you don't want to follow the individual steps in this section you can copy the contents of the template from ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/capi-samples/cluster-api-provider-docker/blob/main/templates/cluster-template.yaml"},"here")," into your new ",(0,r.kt)("strong",{parentName:"p"},"cluster-template.yaml")," file.")),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"Add following steps will relate to adding to the new ",(0,r.kt)("strong",{parentName:"li"},"cluster-template.yaml")," file"),(0,r.kt)("li",{parentName:"ol"},"Add the definition for the root CAPI ",(0,r.kt)("strong",{parentName:"li"},"Cluster"),":")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'---\napiVersion: cluster.x-k8s.io/v1beta1\nkind: Cluster\nmetadata:\n  name: "${CLUSTER_NAME}"\nspec:\n  clusterNetwork:\n    pods:\n      cidrBlocks:\n        - ${POD_CIDR:=172.25.0.0/16}\n    services:\n      cidrBlocks:\n        - ${SERVICES_CIDR:=172.26.0.0/16}\n  infrastructureRef:\n    apiVersion: infrastructure.cluster.x-k8s.io/v1alpha1\n    kind: DockerCluster\n    name: "${CLUSTER_NAME}"\n  controlPlaneRef:\n    kind: KubeadmControlPlane\n    apiVersion: controlplane.cluster.x-k8s.io/v1beta1\n    name: "${CLUSTER_NAME}-control-plane"\n')),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"The ",(0,r.kt)("strong",{parentName:"p"},"Cluster")," is the root and it will eventually own (via ",(0,r.kt)("inlineCode",{parentName:"p"},"ownerReference"),") all the other resource kins.")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"In this example you will see the use of a default value for a token: ",(0,r.kt)("inlineCode",{parentName:"p"},"${POD_CIDR:=172.25.0.0/16}"),". If there is no environment variable called ",(0,r.kt)("strong",{parentName:"p"},"POD_CIDR")," then the default value of ",(0,r.kt)("strong",{parentName:"p"},"172.25.0.0/16")," will be used. A list of the token options can be found ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/a8m/envsubst#docs"},"here"),".")),(0,r.kt)("ol",{start:5},(0,r.kt)("li",{parentName:"ol"},"Now add our infrastructure specific representation of a cluster (i.er ",(0,r.kt)("strong",{parentName:"li"},"DockerCluster"),"):")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'---\napiVersion: infrastructure.cluster.x-k8s.io/v1alpha1\nkind: DockerCluster\nmetadata:\n  name: "${CLUSTER_NAME}"\nspec: {}\n')),(0,r.kt)("ol",{start:6},(0,r.kt)("li",{parentName:"ol"},"To bootstrap the control plane nodes we will use the Kubeadm control plane provider (a.k.a ",(0,r.kt)("strong",{parentName:"li"},"KCP"),"):")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'---\nkind: KubeadmControlPlane\napiVersion: controlplane.cluster.x-k8s.io/v1beta1\nmetadata:\n  name: "${CLUSTER_NAME}-control-plane"\nspec:\n  replicas: ${CONTROL_PLANE_MACHINE_COUNT}\n  version: "${KUBERNETES_VERSION:=v1.23.0}"\n  machineTemplate:\n    infrastructureRef:\n      kind: DockerMachineTemplate\n      apiVersion: infrastructure.cluster.x-k8s.io/v1alpha1\n      name: "${CLUSTER_NAME}-control-plane"\n  kubeadmConfigSpec:\n    initConfiguration:\n        nodeRegistration:\n            # We have to set the criSocket to containerd as kubeadm defaults to docker runtime if both containerd and docker sockets are found\n            criSocket: unix:///var/run/containerd/containerd.sock\n            kubeletExtraArgs:\n              cgroup-driver: cgroupfs\n              eviction-hard: nodefs.available<0%,nodefs.inodesFree<0%,imagefs.available<0%\n    clusterConfiguration:\n        controllerManager:\n            extraArgs: { enable-hostpath-provisioner: \'true\' }\n    joinConfiguration:\n        nodeRegistration:\n            # We have to set the criSocket to containerd as kubeadm defaults to docker runtime if both containerd and docker sockets are found\n            criSocket: unix:///var/run/containerd/containerd.sock\n            kubeletExtraArgs:\n              cgroup-driver: cgroupfs\n              eviction-hard: nodefs.available<0%,nodefs.inodesFree<0%,imagefs.available<0%\n')),(0,r.kt)("ol",{start:7},(0,r.kt)("li",{parentName:"ol"},"In our KCP definition there is a reference to an infrastructure specific machine template (i.e. ",(0,r.kt)("strong",{parentName:"li"},"DockerMachineTemplate"),") that will be used by KCP to create ",(0,r.kt)("strong",{parentName:"li"},"DockerMachine")," for our control planes. So we need to add this template:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'---\nkind: DockerMachineTemplate\napiVersion: infrastructure.cluster.x-k8s.io/v1alpha1\nmetadata:\n  name: "${CLUSTER_NAME}-control-plane"\nspec:\n  template:\n    spec: {}\n')),(0,r.kt)("ol",{start:8},(0,r.kt)("li",{parentName:"ol"},"The cluster and control plane have now been defined. Lets all a ",(0,r.kt)("strong",{parentName:"li"},"MachineDeployment")," for our clusters worker nodes:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'---\napiVersion: cluster.x-k8s.io/v1beta1\nkind: MachineDeployment\nmetadata:\n  name: "${CLUSTER_NAME}-md-0"\nspec:\n  clusterName: "${CLUSTER_NAME}"\n  replicas: ${WORKER_MACHINE_COUNT}\n  selector:\n    matchLabels:\n  template:\n    spec:\n      clusterName: "${CLUSTER_NAME}"\n      version: "${KUBERNETES_VERSION:=v1.23.0}"\n      bootstrap:\n        configRef:\n          name: "${CLUSTER_NAME}-md-0"\n          apiVersion: bootstrap.cluster.x-k8s.io/v1beta1\n          kind: KubeadmConfigTemplate\n      infrastructureRef:\n        name: "${CLUSTER_NAME}-md-0"\n        apiVersion: infrastructure.cluster.x-k8s.io/v1alpha1\n        kind: DockerMachineTemplate\n')),(0,r.kt)("ol",{start:9},(0,r.kt)("li",{parentName:"ol"},"A bit like the KCP definition the ",(0,r.kt)("strong",{parentName:"li"},"MachineDeployment")," holds a reference to the machine template to use for creating worker machines. Lets add that:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'---\napiVersion: infrastructure.cluster.x-k8s.io/v1alpha1\nkind: DockerMachineTemplate\nmetadata:\n  name: "${CLUSTER_NAME}-md-0"\nspec:\n  template:\n    spec: {}\n')),(0,r.kt)("ol",{start:10},(0,r.kt)("li",{parentName:"ol"},"The ",(0,r.kt)("strong",{parentName:"li"},"MachineDeployment")," also contained a reference to the bootstrap provider to use when bootstrapping kubernetes on the infrastructure machines. The bootstrap provider normally matches the control plance provider, so in our case we need to use the Kubeadm bootstrap provider (a.k.a ",(0,r.kt)("strong",{parentName:"li"},"CAPBK"),"):")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'---\napiVersion: bootstrap.cluster.x-k8s.io/v1beta1\nkind: KubeadmConfigTemplate\nmetadata:\n  name: "${CLUSTER_NAME}-md-0"\nspec:\n  template:\n    spec:\n      joinConfiguration:\n        nodeRegistration:\n          # We have to set the criSocket to containerd as kubeadm defaults to docker runtime if both containerd and docker sockets are found\n          criSocket: unix:///var/run/containerd/containerd.sock\n          kubeletExtraArgs:\n            cgroup-driver: cgroupfs\n            eviction-hard: nodefs.available<0%,nodefs.inodesFree<0%,imagefs.available<0%\n')),(0,r.kt)("h2",{id:"generate-the-template"},"Generate the template"),(0,r.kt)("p",null,"Now we have the template defined we can test it using clusterctl."),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Open a new terminal and go to your provider's repo."),(0,r.kt)("li",{parentName:"ol"},"Create environment variables with values for all the tokens in the template (that don't have a default values):")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"export KUBERNETES_VERSION=v1.23.0\nexport CLUSTER_NAME=kubecontest\nexport CONTROL_PLANE_MACHINE_COUNT=1\nexport WORKER_MACHINE_COUNT=1\n")),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"Use ",(0,r.kt)("strong",{parentName:"li"},"clusterctl")," to generate the cluster definition:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"clusterctl generate cluster kubecontest --from templates/cluster-template.yaml\n")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"This will output the generated cluster definition to stdout. You should see no tokens in the definition.")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"If you have the kind cluster / tilt still running you can validate this template against the CRDs by saving to a file and running ",(0,r.kt)("inlineCode",{parentName:"p"},"kubectl apply -f cluster.yaml --dry-run=server"))),(0,r.kt)("p",null,"Let's save the cluster template for the next step."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"clusterctl generate cluster kubecontest --from templates/cluster-template.yaml > cluster.yaml\n")),(0,r.kt)("h2",{id:"deploy-a-cluster"},"Deploy a cluster"),(0,r.kt)("p",null,"It's time to deploy a cluster. Apply the command."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"\u279c  kubectl apply -f cluster.yaml\ncluster.cluster.x-k8s.io/kubecontest created\ndockercluster.infrastructure.cluster.x-k8s.io/kubecontest created\nkubeadmcontrolplane.controlplane.cluster.x-k8s.io/kubecontest-control-plane created\ndockermachinetemplate.infrastructure.cluster.x-k8s.io/kubecontest-control-plane created\nmachinedeployment.cluster.x-k8s.io/kubecontest-md-0 created\ndockermachinetemplate.infrastructure.cluster.x-k8s.io/kubecontest-md-0 created\nkubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/kubecontest-md-0 created\n")),(0,r.kt)("p",null,"You can watch the status of cluster creation using ",(0,r.kt)("inlineCode",{parentName:"p"},"clusterctl describe cluster")," command. The status will change as cluster creation progresses."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"\u279c  clusterctl describe cluster kubecontest\nNAME                                                            READY  SEVERITY  REASON                           SINCE  MESSAGE\nCluster/kubecontest                                             False  Warning   ScalingUp                        16s    Scaling up control plane to 1 replicas (actual 0)\n\u251c\u2500ClusterInfrastructure - DockerCluster/kubecontest\n\u251c\u2500ControlPlane - KubeadmControlPlane/kubecontest-control-plane  False  Warning   ScalingUp                        16s    Scaling up control plane to 1 replicas (actual 0)\n\u2502 \u2514\u2500Machine/kubecontest-control-plane-8pj4p                     False  Info      Bootstrapping                    11s    1 of 2 completed\n\u2514\u2500Workers\n  \u2514\u2500MachineDeployment/kubecontest-md-0                          False  Warning   WaitingForAvailableMachines      16s    Minimum availability requires 1 replicas, current 0 available\n    \u2514\u2500Machine/kubecontest-md-0-67db999895-6nsnj                 False  Info      WaitingForControlPlaneAvailable  16s    0 of 2 completed\n")),(0,r.kt)("p",null,"You can also get the info of each resource."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'\u279c  kubectl get cluster\nNAME          PHASE         AGE     VERSION\nkubecontest   Provisioned   5m15s\n\n\u279c  kubectl get dockercluster\nNAME          CLUSTER       READY   ENDPOINT\nkubecontest   kubecontest   true    {"host":"172.18.0.3","port":6443}\n\n\u279c  kubectl get dockermachine\nNAME                              CLUSTER       MACHINE                             PROVIDERID                                     READY\nkubecontest-control-plane-plpgq   kubecontest   kubecontest-control-plane-8pj4p     docker:////kubecontest-control-plane-8pj4p     True\nkubecontest-md-0-6rbbc            kubecontest   kubecontest-md-0-67db999895-6nsnj   docker:////kubecontest-md-0-67db999895-6nsnj   True\n')),(0,r.kt)("p",null,"To get more detailed information about a specific resource, do the following. For example, if you want to see a control plane docker machine's detailed status"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'\u279c  kubectl get dockermachine kubecontest-control-plane-plpgq -o yaml\napiVersion: infrastructure.cluster.x-k8s.io/v1alpha1\nkind: DockerMachine\nmetadata:\n  annotations:\n    cluster.x-k8s.io/cloned-from-groupkind: DockerMachineTemplate.infrastructure.cluster.x-k8s.io\n    cluster.x-k8s.io/cloned-from-name: kubecontest-control-plane\n  finalizers:\n  - dockermachine.infrastructure.cluster.x-k8s.io\n  labels:\n    cluster.x-k8s.io/cluster-name: kubecontest\n    cluster.x-k8s.io/control-plane: ""\n  name: kubecontest-control-plane-plpgq\n  namespace: default\n  ownerReferences:\n  - apiVersion: controlplane.cluster.x-k8s.io/v1beta1\n    kind: KubeadmControlPlane\n    name: kubecontest-control-plane\n    uid: 522117d4-d088-4618-9b7a-802eeee34841\n  - apiVersion: cluster.x-k8s.io/v1beta1\n    blockOwnerDeletion: true\n    controller: true\n    kind: Machine\n    name: kubecontest-control-plane-8pj4p\n    uid: 7cdc80cb-0f81-4216-a377-395d99d9e090\nspec:\n  bootstrapped: true\n  providerID: docker:////kubecontest-control-plane-8pj4p\nstatus:\n  addresses:\n  - address: kubecontest-control-plane-8pj4p\n    type: Hostname\n  - address: 172.18.0.4\n    type: InternalIP\n  - address: 172.18.0.4\n    type: ExternalIP\n  conditions:\n  - lastTransitionTime: "2022-10-25T13:13:41Z"\n    status: "True"\n    type: Ready\n  - lastTransitionTime: "2022-10-25T13:13:41Z"\n    status: "True"\n    type: BootstrapExecSucceeded\n  - lastTransitionTime: "2022-10-25T13:13:24Z"\n    status: "True"\n    type: ContainerProvisioned\n  loadBalancerConfigured: true\n  ready: true\n')),(0,r.kt)("p",null,"You can also see docker containers coming up. It shows the load balancer, ",(0,r.kt)("inlineCode",{parentName:"p"},"kubecontest-lb"),", one control plane, ",(0,r.kt)("inlineCode",{parentName:"p"},"kubecontest-control-plane-xxx")," and one worker machine, ",(0,r.kt)("inlineCode",{parentName:"p"},"kubecontest-md-xxx"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'\u279c  docker ps\nCONTAINER ID   IMAGE                            COMMAND                  CREATED          STATUS          PORTS                                                                    NAMES\nd7b31b6f4814   kindest/node:v1.23.0             "/usr/local/bin/entr\u2026"   10 minutes ago   Up 10 minutes                                                                            kubecontest-md-0-67db999895-ghkxt\n9fee27003748   kindest/node:v1.23.0             "/usr/local/bin/entr\u2026"   11 minutes ago   Up 11 minutes   44591/tcp, 127.0.0.1:44591->6443/tcp                                     kubecontest-control-plane-8njhj\n9318bd56bece   haproxytech/haproxy-alpine:2.4   "/docker-entrypoint.\u2026"   16 minutes ago   Up 16 minutes   37579/tcp, 39827/tcp, 0.0.0.0:37579->6443/tcp, 0.0.0.0:39827->8404/tcp   kubecontest-lb\n6d9cedd53689   kindest/node:v1.24.0             "/usr/local/bin/entr\u2026"   6 days ago       Up 6 days       127.0.0.1:56641->6443/tcp                                                capi-test-control-plane\n')),(0,r.kt)("p",null,"To understand what's happening, watch the controller logs (either in Tilt UI or by command line)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# docker controller log\nkubectl logs -n capdkc-system capdkc-controller-manager-xxx\n\n# capi controller log\nkubectl logs -n capi-system capi-controller-manager-xxx\n\n# kcp controller log\nkubectl logs -n capi-kubeadm-control-plane-system capi-kubeadm-control-plane-controller-manager-xxx\n")),(0,r.kt)("p",null,"Clean up (optional - whenever you want to delete the cluster)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl delete cluster kubecontest\n")))}p.isMDXComponent=!0}}]);