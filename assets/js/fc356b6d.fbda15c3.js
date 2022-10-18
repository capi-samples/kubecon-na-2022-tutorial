"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[220],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>f});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},s=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),d=p(n),f=a,m=d["".concat(c,".").concat(f)]||d[f]||u[f]||o;return n?r.createElement(m,l(l({ref:t},s),{},{components:n})):r.createElement(m,l({ref:t},s))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=d;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var p=2;p<o;p++)l[p]=n[p];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},2684:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>u,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var r=n(7462),a=(n(7294),n(3905));const o={},l="Scaffolding",i={unversionedId:"scaffolding",id:"scaffolding",title:"Scaffolding",description:"Objective these steps are applicable to any operator you want to build.",source:"@site/docs/3-scaffolding.md",sourceDirName:".",slug:"/scaffolding",permalink:"/docs/scaffolding",draft:!1,editUrl:"https://github.com/capi-samples/kubecon-na-2022-tutorial/docs/3-scaffolding.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Setup",permalink:"/docs/setup"},next:{title:"Setting up Tilt",permalink:"/docs/setup-tilt"}},c={},p=[],s={toc:p};function u(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"scaffolding"},"Scaffolding"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Objective:")," To create the initial project structure for our provider. Learn about the scaffolding tooling. NOTE: these steps are applicable to any operator you want to build."),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"Open your favourite terminal and go to ",(0,a.kt)("inlineCode",{parentName:"li"},"cluster-api-provider-docker")," directory."),(0,a.kt)("li",{parentName:"ol"},"Run the following commands to scaffold the project")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell="},"kubebuilder init --domain  cluster.x-k8s.io --repo github.com/myname/cluster-api-provider-docker --project-version 3\n")),(0,a.kt)("ol",{start:3},(0,a.kt)("li",{parentName:"ol"},"Run the following commands to scaffold the API & controllers for the ",(0,a.kt)("strong",{parentName:"li"},"DockerCluster")," and ",(0,a.kt)("strong",{parentName:"li"},"DockerMachine"),", ensuring you answer ",(0,a.kt)("strong",{parentName:"li"},"Y")," to the following:\na. Create Resource\nb. Create Controller")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell!="},"kubebuilder create api --group infrastructure --version v1alpha1 --kind DockerCluster\nkubebuilder create api --group infrastructure --version v1alpha1 --kind DockerMachine\n")),(0,a.kt)("p",null,"If you get the following error:"),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},(0,a.kt)("inlineCode",{parentName:"p"},"/usr/local/go/src/net/cgo_linux.go:12:8: no such package located"))),(0,a.kt)("p",null,"Then you should install ",(0,a.kt)("inlineCode",{parentName:"p"},"gcc")," and set the ",(0,a.kt)("inlineCode",{parentName:"p"},"CGO_ENABLED")," environment variable to 0 to disable cgo"),(0,a.kt)("ol",{start:4},(0,a.kt)("li",{parentName:"ol"},"Run the following commands:")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"make generate\nmake manifests\nmake build\n")),(0,a.kt)("ol",{start:5},(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Take a look at the generated code:"),(0,a.kt)("ol",{parentName:"li"},(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"api/v1alpha1")," folder contains the CRD definitions for your infrastructure cluster & machine"),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"controllers")," contains the controllers that will reconcile instances of your infrastructure CRDs"),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("inlineCode",{parentName:"li"},"config")," contains the Kubernetes artifacts that will be bundled together and used when deploying our provider"))),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},"Make a change to ",(0,a.kt)("inlineCode",{parentName:"p"},"main.go")," change the port for the ",(0,a.kt)("strong",{parentName:"p"},"health-probe-bind-address")," flag from ",(0,a.kt)("inlineCode",{parentName:"p"},"8081")," to ",(0,a.kt)("inlineCode",{parentName:"p"},"9440"),":"))),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-go"},'flag.StringVar(&probeAddr, "health-probe-bind-address", ":9440", "The address the probe endpoint binds to.")\n')),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"This change is required as the liveness/readiness probes get generated using port 9440 but the code uses 8081 by default. If you don't change this then when you deploy the liveness and readiness probes will fail")))}u.isMDXComponent=!0}}]);