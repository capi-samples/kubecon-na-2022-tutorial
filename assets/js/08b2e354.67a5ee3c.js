"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[586],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>d});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=u(r),d=o,k=m["".concat(s,".").concat(d)]||m[d]||c[d]||a;return r?n.createElement(k,i(i({ref:t},p),{},{components:r})):n.createElement(k,i({ref:t},p))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var u=2;u<a;u++)i[u]=r[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},2971:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>c,frontMatter:()=>a,metadata:()=>l,toc:()=>u});var n=r(7462),o=(r(7294),r(3905));const a={},i="Pre-reqs",l={unversionedId:"prereqs",id:"prereqs",title:"Pre-reqs",description:"You will need to install the following to follow along with this tutorial:",source:"@site/docs/1-prereqs.md",sourceDirName:".",slug:"/prereqs",permalink:"/kubecon-na-2022-tutorial/docs/prereqs",draft:!1,editUrl:"https://github.com/capi-samples/kubecon-na-2022-tutorial/docs/1-prereqs.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{},sidebar:"tutorialSidebar",next:{title:"Setup",permalink:"/kubecon-na-2022-tutorial/docs/setup"}},s={},u=[{value:"System pre-reqs",id:"system-pre-reqs",level:2}],p={toc:u};function c(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"pre-reqs"},"Pre-reqs"),(0,o.kt)("p",null,"You will need to install the following to follow along with this tutorial:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"git"),(0,o.kt)("li",{parentName:"ul"},"make"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://go.dev/dl/"},"Go v1.19")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/kubernetes-sigs/kubebuilder/releases/tag/v3.6.0"},"Kubebuilder v3.6.0")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.docker.com/get-docker/"},"Docker")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.tilt.dev/install.html"},"Tilt")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://kubernetes.io/docs/tasks/tools/"},"Kubectl")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/kubernetes-sigs/kustomize"},"Kustomize")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://kind.sigs.k8s.io/"},"kind")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/kubernetes-sigs/cluster-api/releases"},"clusterctl"))),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"NOTE: we are not using v3.7.0 for Kubebuilder due to an issue with Apple M1 Silicon")),(0,o.kt)("h2",{id:"system-pre-reqs"},"System pre-reqs"),(0,o.kt)("p",null,"Under the hood, we will use the kubeadm control plane provider and kubeadm bootstrap provider for bootstrapping a Kubernetes node. So it is recommended to have the same system requirements as kubeadm to avoid any ",(0,o.kt)("inlineCode",{parentName:"p"},"kubeadm init")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"kubeadm join")," failures. For a detailed list of kubeadm pre-reqs, refer the official documentation ",(0,o.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin"},"here"),"."),(0,o.kt)("p",null,"At the minimum,"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"2 GB or more of RAM per machine"),(0,o.kt)("li",{parentName:"ul"},"2 CPUs or more")))}c.isMDXComponent=!0}}]);