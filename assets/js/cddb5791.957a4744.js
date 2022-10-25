"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[473],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=p(n),d=r,k=u["".concat(s,".").concat(d)]||u[d]||m[d]||o;return n?a.createElement(k,l(l({ref:t},c),{},{components:n})):a.createElement(k,l({ref:t},c))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=u;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var p=2;p<o;p++)l[p]=n[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},9525:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>m,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var a=n(7462),r=(n(7294),n(3905));const o={},l="Setting up Tilt",i={unversionedId:"setup-tilt",id:"setup-tilt",title:"Setting up Tilt",description:"Objective: Learn how to setup Tilt to enable us to develop the provider in a rapid & iterative manner. Also learn how we can attach a debugger to the provider.",source:"@site/docs/4-setup-tilt.md",sourceDirName:".",slug:"/setup-tilt",permalink:"/kubecon-na-2022-tutorial/docs/setup-tilt",draft:!1,editUrl:"https://github.com/capi-samples/kubecon-na-2022-tutorial/docs/4-setup-tilt.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Scaffolding",permalink:"/kubecon-na-2022-tutorial/docs/scaffolding"},next:{title:"Implementing the cluster controller",permalink:"/kubecon-na-2022-tutorial/docs/cluster-implementation"}},s={},p=[{value:"Debugging",id:"debugging",level:2}],c={toc:p};function m(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"setting-up-tilt"},"Setting up Tilt"),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Objective:")," Learn how to setup ",(0,r.kt)("inlineCode",{parentName:"p"},"Tilt")," to enable us to develop the provider in a rapid & iterative manner. Also learn how we can attach a debugger to the provider."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Background:")," Every CAPI provider has a ",(0,r.kt)("inlineCode",{parentName:"p"},"tilt-provider.json")," in the root of its repo which is used by the upstream CAPI Tiltfile to tell it about your provider. This is used to configure hot reloading and the categorization within the tilt ui"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Ensure ",(0,r.kt)("strong",{parentName:"li"},"Tilt")," and ",(0,r.kt)("strong",{parentName:"li"},"kind")," are installed"),(0,r.kt)("li",{parentName:"ol"},"Create a new file in the root of your providers repo called ",(0,r.kt)("inlineCode",{parentName:"li"},"tilt-provider.json"),"."),(0,r.kt)("li",{parentName:"ol"},"Add the following contents to the file:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'[\n    {\n      "name": "docker-kubecon",\n      "config": {\n        "image": "ghcr.io/capi-samples/cluster-api-provider-docker:dev",\n        "live_reload_deps": [\n          "main.go",\n          "go.mod",\n          "go.sum",\n          "api",\n          "controllers",\n          "pkg"\n        ],\n        "label": "CAPDKC"\n      }\n    }\n]\n')),(0,r.kt)("ol",{start:4},(0,r.kt)("li",{parentName:"ol"},"Note the following from the content:",(0,r.kt)("ol",{parentName:"li"},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"name")," is the name of the provider you would use with ",(0,r.kt)("inlineCode",{parentName:"li"},"clusterctl")," and when configuring Tilt in CAPI"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"image")," is the name of the image that Tilt will look for modifying the kubernetes artifacts."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"live_reload_deps")," is a list of files & folders that will be monitored for changes. If a change occurs then Tilt will rebuild your provider and re-install it into the cluster"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"label")," is required for the Tilt UI"),(0,r.kt)("li",{parentName:"ol"},"You can have more than 1 provider in a repo so this block could be repeated many times.")))),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"NOTE: There are conventions that relate to the acronym used for a CAPI provider. Infrastructure providers start with ",(0,r.kt)("strong",{parentName:"p"},"CAP")," and then a one or more characters (but not ",(0,r.kt)("strong",{parentName:"p"},"BP"),"), for example CAPA for the AWS provider, CAPZ for the Azure provider. A bootstrap provider starts with ",(0,r.kt)("strong",{parentName:"p"},"CAPBP")," and then one or characters, for example CAPBPK for the Kubeadm bootstrap provider.")),(0,r.kt)("ol",{start:5},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Edit the ",(0,r.kt)("inlineCode",{parentName:"p"},"config/default/kustomization.yaml")," in your provider repo:"),(0,r.kt)("ol",{parentName:"li"},(0,r.kt)("li",{parentName:"ol"},"Change the ",(0,r.kt)("inlineCode",{parentName:"li"},"namespace")," to ",(0,r.kt)("strong",{parentName:"li"},"capdkc-system")),(0,r.kt)("li",{parentName:"ol"},"Change the ",(0,r.kt)("inlineCode",{parentName:"li"},"namePrefix")," to ",(0,r.kt)("strong",{parentName:"li"},"capdkc-")),(0,r.kt)("li",{parentName:"ol"},"Uncomment and add a label to ",(0,r.kt)("inlineCode",{parentName:"li"},"commonLabels")," called ",(0,r.kt)("strong",{parentName:"li"},"cluster.x-k8s.io/provider")," with a value of ",(0,r.kt)("strong",{parentName:"li"},'"infrastructure-capdkc"')))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Create the ",(0,r.kt)("inlineCode",{parentName:"p"},"config/default/manager_image_patch.yaml")," file and add the following contents:"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: controller-manager\n  namespace: system\nspec:\n  template:\n    spec:\n      containers:\n      - image: ghcr.io/capi-samples/cluster-api-provider-docker:dev\n        name: manager\n")),(0,r.kt)("ol",{start:7},(0,r.kt)("li",{parentName:"ol"},"Edit ",(0,r.kt)("inlineCode",{parentName:"li"},"config/default/kustomization.yaml")," and add ",(0,r.kt)("inlineCode",{parentName:"li"},"manager_image_patch.yaml")," to ",(0,r.kt)("strong",{parentName:"li"},"patchesStrategicMerge")),(0,r.kt)("li",{parentName:"ol"},"Delete the ",(0,r.kt)("inlineCode",{parentName:"li"},"config/default/manager_auth_proxy_patch.yaml")," and ",(0,r.kt)("inlineCode",{parentName:"li"},"config/default/manager_config_patch.yaml")," files."),(0,r.kt)("li",{parentName:"ol"},"Edit ",(0,r.kt)("inlineCode",{parentName:"li"},"config/default/kustomization.yaml")," and remove ",(0,r.kt)("inlineCode",{parentName:"li"},"manager_auth_proxy_patch.yaml")," from ",(0,r.kt)("strong",{parentName:"li"},"patchesStrategicMerge")),(0,r.kt)("li",{parentName:"ol"},"Delete ",(0,r.kt)("inlineCode",{parentName:"li"},"config/manager/controller_manager_config.yaml")),(0,r.kt)("li",{parentName:"ol"},"Edit ",(0,r.kt)("inlineCode",{parentName:"li"},"config/manager/kustomization.yaml")," so that its contents match:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"resources:\n- manager.yaml\n")),(0,r.kt)("ol",{start:12},(0,r.kt)("li",{parentName:"ol"},"Replace the contents of ",(0,r.kt)("inlineCode",{parentName:"li"},"config/manager/manager.yaml")," with the following:")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"NOTE: we can change this and supply a link to the file in github instead")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},'apiVersion: v1\nkind: Namespace\nmetadata:\n  labels:\n    control-plane: controller-manager\n  name: system\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: controller-manager\n  namespace: system\n  labels:\n    control-plane: controller-manager\nspec:\n  selector:\n    matchLabels:\n      control-plane: controller-manager\n  replicas: 1\n  template:\n    metadata:\n      labels:\n        control-plane: controller-manager\n    spec:\n      containers:\n      - args:\n        - "--leader-elect"\n        image: controller:latest\n        name: manager\n        env:\n        - name: POD_NAMESPACE\n          valueFrom:\n            fieldRef:\n              fieldPath: metadata.namespace\n        - name: POD_NAME\n          valueFrom:\n            fieldRef:\n              fieldPath: metadata.name\n        - name: POD_UID\n          valueFrom:\n            fieldRef:\n              fieldPath: metadata.uid\n        ports:\n        - containerPort: 9440\n          name: healthz\n          protocol: TCP\n        readinessProbe:\n          httpGet:\n            path: /readyz\n            port: healthz\n        livenessProbe:\n          httpGet:\n            path: /healthz\n            port: healthz\n        volumeMounts:\n          - mountPath: /var/run/docker.sock\n            name: dockersock\n        securityContext:\n          privileged: true\n      terminationGracePeriodSeconds: 10\n      serviceAccountName: controller-manager\n      tolerations:\n      - effect: NoSchedule\n        key: node-role.kubernetes.io/master\n      - effect: NoSchedule\n        key: node-role.kubernetes.io/control-plane\n      volumes:\n        - name: dockersock\n          hostPath:\n            path: /var/run/docker.sock\n\n')),(0,r.kt)("ol",{start:13},(0,r.kt)("li",{parentName:"ol"},"To enable CAPI to perform conversion of object references we must state what versions of CAPI matches our providers. This is done using a label on the CRDS.",(0,r.kt)("ol",{parentName:"li"},(0,r.kt)("li",{parentName:"ol"},"Open ",(0,r.kt)("inlineCode",{parentName:"li"},"config/crd/kustomization.yaml")),(0,r.kt)("li",{parentName:"ol"},"Add the following after the ",(0,r.kt)("strong",{parentName:"li"},"resources")," section:")),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-go"},"commonLabels:\n  cluster.x-k8s.io/v1beta1: v1alpha1\n")),(0,r.kt)("blockquote",{parentName:"li"},(0,r.kt)("p",{parentName:"blockquote"},"See the ",(0,r.kt)("a",{parentName:"p",href:"https://cluster-api.sigs.k8s.io/developer/providers/contracts.html#api-version-labels"},"provider contract")," for more details"))),(0,r.kt)("li",{parentName:"ol"},"Create a ",(0,r.kt)("inlineCode",{parentName:"li"},"tilt-settings.json")," file in the root of your forked/cloned ",(0,r.kt)("inlineCode",{parentName:"li"},"cluster-api")," directory."),(0,r.kt)("li",{parentName:"ol"},'Add the following contents to the file (replace "yourname" with your github account name):')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n    "default_registry": "gcr.io/yourname",\n    "provider_repos": ["../../github.com/yourname/cluster-api-provider-docker"],\n    "enable_providers": ["docker-kubecon", "kubeadm-bootstrap", "kubeadm-control-plane"],\n    "kustomize_substitutions": {\n        "EXP_MACHINE_POOL": "true",\n        "EXP_CLUSTER_RESOURCE_SET": "true"\n    },\n    "extra_args": {\n        "docker-kubecon": ["-zap-log-level=debug"],\n    },\n    "debug": {\n        "docker-kubecon": {\n            "continue": true,\n            "port": 31000\n        }\n    }\n}\n')),(0,r.kt)("ol",{start:16},(0,r.kt)("li",{parentName:"ol"},"We will not cover every setting in this file (see ",(0,r.kt)("a",{parentName:"li",href:"https://cluster-api.sigs.k8s.io/developer/tilt.html#tilt-settings-fields"},"Cluster API doc")," for more info) but note the following:",(0,r.kt)("ol",{parentName:"li"},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"provider_repos"),": contains the path to your clones providers repo"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"enable_providers"),": this is where we say which providers we want installed in our local management cluster. We are using the ",(0,r.kt)("strong",{parentName:"li"},"docker-kubecon")," here for our provider and this matches the name in the ",(0,r.kt)("inlineCode",{parentName:"li"},"tilt-provider.json")," file"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"debug"),": we are saying that we want our provider to be started via delve and the debugger to listen on port ",(0,r.kt)("strong",{parentName:"li"},"30000"),"."))),(0,r.kt)("li",{parentName:"ol"},"Open another terminal (or pane) and go to the ",(0,r.kt)("inlineCode",{parentName:"li"},"cluster-api")," directory."),(0,r.kt)("li",{parentName:"ol"},"Run the following to create a configuration for kind:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"cat > kind-cluster-with-extramounts.yaml <<EOF\nkind: Cluster\napiVersion: kind.x-k8s.io/v1alpha4\nname: capi-test\nnodes:\n- role: control-plane\n  extraMounts:\n    - hostPath: /var/run/docker.sock\n      containerPath: /var/run/docker.sock\nEOF\n")),(0,r.kt)("ol",{start:19},(0,r.kt)("li",{parentName:"ol"},"Run the following command to create a local kind cluster:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"kind create cluster --config kind-cluster-with-extramounts.yaml\n")),(0,r.kt)("ol",{start:20},(0,r.kt)("li",{parentName:"ol"},"Now start tilt by running the following:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"tilt up\n")),(0,r.kt)("ol",{start:21},(0,r.kt)("li",{parentName:"ol"},"Press the ",(0,r.kt)("strong",{parentName:"li"},"space")," key to see the Tilt web ui and check that everything goes green.")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"You can click on ",(0,r.kt)("strong",{parentName:"p"},"(Tiltfile)")," to see all the resources.")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Congratulations you now have your provider running via Tilt. If you make any code changes you should see that your provider is automatically rebuilt")),(0,r.kt)("h2",{id:"debugging"},"Debugging"),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Objective:")," Attach a debugger to the provider which is running via delve. "),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Background:")," We will use VSCode as an example but similar steps can be used for other IDEs such as Goland"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Create the following file (if it doesn't exists) ",(0,r.kt)("inlineCode",{parentName:"li"},".vscode/launch.json")," in your providers repo"),(0,r.kt)("li",{parentName:"ol"},"Add the following launch configuration to it:")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n    "version": "0.2.0",\n    "configurations": [\n        {\n            "name": "Connect to docker provider",\n            "type": "go",\n            "request": "attach",\n            "mode": "remote",\n            "remotePath": "${workspaceFolder}",\n            "port": 30000,\n            "host": "127.0.0.1"\n        }\n    ]\n}\n')),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"Set any breakpoints (such as on the ",(0,r.kt)("inlineCode",{parentName:"li"},"Reconcile")," functions) and then start the debugger in VSCode.")))}m.isMDXComponent=!0}}]);