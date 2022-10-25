"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[381],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),c=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return a.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},k=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),k=c(n),m=r,p=k["".concat(s,".").concat(m)]||k[m]||d[m]||o;return n?a.createElement(p,i(i({ref:t},u),{},{components:n})):a.createElement(p,i({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=k;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var c=2;c<o;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}k.displayName="MDXCreateElement"},7416:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var a=n(7462),r=(n(7294),n(3905));const o={},i="Adding webhooks",l={unversionedId:"webhooks",id:"webhooks",title:"Adding webhooks",description:"Background",source:"@site/docs/10-webhooks.md",sourceDirName:".",slug:"/webhooks",permalink:"/kubecon-na-2022-tutorial/docs/webhooks",draft:!1,editUrl:"https://github.com/capi-samples/kubecon-na-2022-tutorial/docs/10-webhooks.md",tags:[],version:"current",sidebarPosition:10,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Implementing the machine controller",permalink:"/kubecon-na-2022-tutorial/docs/machine-implementation"},next:{title:"Cluster Templates",permalink:"/kubecon-na-2022-tutorial/docs/templates"}},s={},c=[{value:"Background",id:"background",level:2},{value:"Instructions",id:"instructions",level:2},{value:"Pre-req - Check Cert manager installation",id:"pre-req---check-cert-manager-installation",level:3},{value:"Implement defaulting/validating webhooks",id:"implement-defaultingvalidating-webhooks",level:3},{value:"Enable webhook and cert-manager",id:"enable-webhook-and-cert-manager",level:3},{value:"Generate webhook manifests",id:"generate-webhook-manifests",level:3},{value:"Deploy Webhooks",id:"deploy-webhooks",level:3},{value:"Let&#39;s add a simple validation",id:"lets-add-a-simple-validation",level:3},{value:"Resource",id:"resource",level:2}],u={toc:c};function d(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"adding-webhooks"},"Adding webhooks"),(0,r.kt)("h2",{id:"background"},"Background"),(0,r.kt)("p",null,"Admission webhooks are HTTP callbacks that receive admission requests, process them and return admission responses."),(0,r.kt)("p",null,"Kubernetes provides the following types of admission webhooks:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Mutating Admission Webhook",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"These can mutate the object while it\u2019s being created or updated, before it gets stored. "),(0,r.kt)("li",{parentName:"ul"},"It can be used to default fields in a resource requests, e.g. fields in Deployment that are not specified by the user. It can be used to inject sidecar containers."))),(0,r.kt)("li",{parentName:"ul"},"Validating Admission Webhook",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"These can validate the object while it\u2019s being created or updated, before it gets stored. "),(0,r.kt)("li",{parentName:"ul"},"It allows more complex validation than pure schema-based validation. e.g. cross-field validation and pod image whitelisting.")))),(0,r.kt)("p",null,"If you want to implement admission webhooks for your CRD, the only thing you need to do is to implement the Defaulter and (or) the Validator interface."),(0,r.kt)("p",null,"Kubebuilder takes care of the following."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Creating the webhook server."),(0,r.kt)("li",{parentName:"ul"},"Ensuring the server has been added in the manager."),(0,r.kt)("li",{parentName:"ul"},"Creating handlers for your webhooks."),(0,r.kt)("li",{parentName:"ul"},"Registering each handler with a path in your server.")),(0,r.kt)("hr",null),(0,r.kt)("h2",{id:"instructions"},"Instructions"),(0,r.kt)("h3",{id:"pre-req---check-cert-manager-installation"},"Pre-req - Check Cert manager installation"),(0,r.kt)("p",null,"We use cert manager to provision the certificates for the webhook server. If you have followed the Tilt instruction in ",(0,r.kt)("inlineCode",{parentName:"p"},"4-setup-tilt.md"),", cert-manager should be deployed already."),(0,r.kt)("p",null,"Check if the cert-manager is deployed."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"\u279c  kubectl get po -n cert-manager\nNAME                                       READY   STATUS    RESTARTS        AGE\ncert-manager-5dd59d9d9b-vf4wb              1/1     Running   1 (2d19h ago)   3d18h\ncert-manager-cainjector-8696fc9f89-bjscf   1/1     Running   2 (2d19h ago)   3d18h\ncert-manager-webhook-7d4b5b8c56-4mqfz      1/1     Running   2 (2d19h ago)   3d18h\n")),(0,r.kt)("h3",{id:"implement-defaultingvalidating-webhooks"},"Implement defaulting/validating webhooks"),(0,r.kt)("p",null,"Run the following commands to scaffold webhooks for ",(0,r.kt)("inlineCode",{parentName:"p"},"DockerCluster"),". Run with the ",(0,r.kt)("inlineCode",{parentName:"p"},"--defaulting")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"--programmatic-validation")," flags to use defaulting and validating webhooks."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"kubebuilder create webhook --group infrastructure --version v1alpha1 --kind DockerCluster --defaulting --programmatic-validation\n")),(0,r.kt)("p",null,"This will scaffold the webhook functions and register your webhook with the manager in your ",(0,r.kt)("inlineCode",{parentName:"p"},"main.go")," for you."),(0,r.kt)("p",null,"Review the newly generated file, ",(0,r.kt)("inlineCode",{parentName:"p"},"api/v1alpha1/dockercluster_webhook.go")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-go"},'var dockerclusterlog = logf.Log.WithName("dockercluster-resource")\n\nfunc (r *DockerCluster) SetupWebhookWithManager(mgr ctrl.Manager) error {\n    return ctrl.NewWebhookManagedBy(mgr).\n        For(r).\n        Complete()\n}\n...\n')),(0,r.kt)("p",null,"Notice that kubebuilder markers were added to generate webhook manifests."),(0,r.kt)("p",null,"This marker is responsible for generating a mutating webhook manifest."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-go"},"//+kubebuilder:webhook:path=/mutate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster,mutating=true,failurePolicy=fail,sideEffects=None,groups=infrastructure.cluster.x-k8s.io,resources=dockerclusters,verbs=create;update,versions=v1alpha1,name=mdockercluster.kb.io,admissionReviewVersions=v1\n")),(0,r.kt)("p",null,"This marker is responsible for generating a validating webhook manifest."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-go"},"//+kubebuilder:webhook:path=/validate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster,mutating=false,failurePolicy=fail,sideEffects=None,groups=infrastructure.cluster.x-k8s.io,resources=dockerclusters,verbs=create;update,versions=v1alpha1,name=vdockercluster.kb.io,admissionReviewVersions=v1\n")),(0,r.kt)("p",null,"If ",(0,r.kt)("inlineCode",{parentName:"p"},"webhook.Validator")," interface is implemented, a webhook will automatically be served that calls the validation.\nThe ",(0,r.kt)("inlineCode",{parentName:"p"},"ValidateCreate"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"ValidateUpdate")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"ValidateDelete")," methods are expected to validate its receiver upon creation, update and deletion respectively. "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-go"},"var _ webhook.Validator = &DockerCluster{}\n\n// ValidateCreate implements webhook.Validator so a webhook will be registered for the type\nfunc (r *DockerCluster) ValidateCreate() error {\n    ...\n}\n\n// ValidateUpdate implements webhook.Validator so a webhook will be registered for the type\nfunc (r *DockerCluster) ValidateUpdate(old runtime.Object) error {\n    ...\n}\n\n// ValidateDelete implements webhook.Validator so a webhook will be registered for the type\nfunc (r *DockerCluster) ValidateDelete() error {\n    ...\n}\n")),(0,r.kt)("h3",{id:"enable-webhook-and-cert-manager"},"Enable webhook and cert-manager"),(0,r.kt)("p",null,"We need to update kustomization files in ",(0,r.kt)("inlineCode",{parentName:"p"},"config/")," to enable webhook and cert-manager."),(0,r.kt)("p",null,"config/crd/kustomization.yaml"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"- patches/cainjection_in_dockerclusters.yaml # \u2b05\ufe0f uncomment\n#- patches/cainjection_in_dockermachines.yaml\n#- patches/cainjection_in_dockermachinetemplates.yaml\n#+kubebuilder:scaffold:crdkustomizecainjectionpatch\n")),(0,r.kt)("p",null,"config/default/kustomization.yaml"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"bases:\n- ../webhook # \u2b05\ufe0f uncomment\n- ../certmanager # \u2b05\ufe0f uncomment\n\npatchesStrategicMerge:\n- manager_webhook_patch.yaml # \u2b05\ufe0f uncomment\n- webhookcainjection_patch.yaml # \u2b05\ufe0f uncomment\n\n# the following config is for teaching kustomize how to do var substitution\nvars: # \u2b05\ufe0f uncomment the entire section\n- name: CERTIFICATE_NAMESPACE # namespace of the certificate CR\n  objref:\n    kind: Certificate\n    group: cert-manager.io\n    version: v1\n    name: serving-cert # this name should match the one in certificate.yaml\n  fieldref:\n    fieldpath: metadata.namespace\n- name: CERTIFICATE_NAME\n  objref:\n    kind: Certificate\n    group: cert-manager.io\n    version: v1\n    name: serving-cert # this name should match the one in certificate.yaml\n- name: SERVICE_NAMESPACE # namespace of the service\n  objref:\n    kind: Service\n    version: v1\n    name: webhook-service\n  fieldref:\n    fieldpath: metadata.namespace\n- name: SERVICE_NAME\n  objref:\n    kind: Service\n    version: v1\n    name: webhook-service\n")),(0,r.kt)("h3",{id:"generate-webhook-manifests"},"Generate webhook manifests"),(0,r.kt)("p",null,"Run the following command."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"\u279c  make manifests\n")),(0,r.kt)("p",null,"Check and see ",(0,r.kt)("inlineCode",{parentName:"p"},"config/webhook/manifests.yaml")," is generated. The file should contain ",(0,r.kt)("inlineCode",{parentName:"p"},"MutatingWebhookConfiguration")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"ValidatingWebhookConfiguration"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml"},"---\napiVersion: admissionregistration.k8s.io/v1\nkind: MutatingWebhookConfiguration\nmetadata:\n  name: mutating-webhook-configuration\nwebhooks:\n- admissionReviewVersions:\n  - v1\n  clientConfig:\n    service:\n      name: webhook-service\n      namespace: system\n      path: /mutate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster\n      ...\n---\napiVersion: admissionregistration.k8s.io/v1\nkind: ValidatingWebhookConfiguration\nmetadata:\n  name: validating-webhook-configuration\nwebhooks:\n- admissionReviewVersions:\n  - v1\n  clientConfig:\n    service:\n      name: webhook-service\n      namespace: system\n      path: /validate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster\n      ...\n")),(0,r.kt)("h3",{id:"deploy-webhooks"},"Deploy Webhooks"),(0,r.kt)("p",null,"Wait for ",(0,r.kt)("inlineCode",{parentName:"p"},"capdkc-controller")," to be redeployed by Tilt"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"If nothing happens, click the button next to ",(0,r.kt)("inlineCode",{parentName:"li"},"capdkc_controller")," icon to manually trigger it.")),(0,r.kt)("p",null,"See ",(0,r.kt)("inlineCode",{parentName:"p"},"capdkc-controller")," log to confirm that webhooks are successfully deployed."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'\u279c  kubectl logs -n capdkc-system capdkc-controller-manager-6bb95c6584-5xqmk -f\n1.665938630520821e+09   INFO    controller-runtime.metrics  Metrics server is starting to listen    {"addr": ":8080"}\n1.6659386305210242e+09  INFO    controller-runtime.builder  Registering a mutating webhook  {"GVK": "infrastructure.cluster.x-k8s.io/v1alpha1, Kind=DockerCluster", "path": "/mutate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster"}\n1.665938630521065e+09   INFO    controller-runtime.webhook  Registering webhook {"path": "/mutate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster"}\n1.6659386305211687e+09  INFO    controller-runtime.builder  Registering a validating webhook    {"GVK": "infrastructure.cluster.x-k8s.io/v1alpha1, Kind=DockerCluster", "path": "/validate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster"}\n1.665938630521209e+09   INFO    controller-runtime.webhook  Registering webhook {"path": "/validate-infrastructure-cluster-x-k8s-io-v1alpha1-dockercluster"}\n1.6659386305212412e+09  INFO    setup   starting manager\n1.6659386305218532e+09  INFO    controller-runtime.webhook.webhooks Starting webhook server\n1.6659386305219975e+09  INFO    Starting server {"path": "/metrics", "kind": "metrics", "addr": "[::]:8080"}\n1.6659386305220084e+09  INFO    Starting server {"kind": "health probe", "addr": "[::]:8081"}\nI1016 16:43:50.522478      11 leaderelection.go:248] attempting to acquire leader lease capdkc-system/c9b04f86.cluster.x-k8s.io...\n1.6659386305240173e+09  INFO    controller-runtime.certwatcher  Updated current TLS certificate\n1.6659386305244877e+09  INFO    controller-runtime.webhook  Serving webhook server  {"host": "", "port": 9443}\n1.6659386305257964e+09  INFO    controller-runtime.certwatcher  Starting certificate watcher\nI1016 16:44:06.032008      11 leaderelection.go:258] successfully acquired lease capdkc-system/c9b04f86.cluster.x-k8s.io\n')),(0,r.kt)("h3",{id:"lets-add-a-simple-validation"},"Let's add a simple validation"),(0,r.kt)("p",null,"Open ",(0,r.kt)("inlineCode",{parentName:"p"},"api/v1alpha1/dockercluster_webhook.go")," and edit ",(0,r.kt)("inlineCode",{parentName:"p"},"ValidateCreate")," function. The webhook will reject a docker cluster named ",(0,r.kt)("inlineCode",{parentName:"p"},"kubecon-eu")," to be created."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-go"},'// ValidateCreate implements webhook.Validator so a webhook will be registered for the type\nfunc (r *DockerCluster) ValidateCreate() error {\n    dockerclusterlog.Info("validate create", "name", r.Name)\n\n    if r.Name == "kubecon-eu" {\n        return fmt.Errorf("docker cluster name cannot be kubecon-eu")\n    }\n\n    return nil\n}\n')),(0,r.kt)("p",null,"Generate a new cluster template."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"export KUBERNETES_VERSION=v1.23.0\nexport CLUSTER_NAME=kubecon-eu\nexport CONTROL_PLANE_MACHINE_COUNT=1\nexport WORKER_MACHINE_COUNT=1\n\nclusterctl generate cluster -i docker-kubecon:$RELEASE_VERSION  $CLUSTER_NAME > cluster-test.yaml\n")),(0,r.kt)("p",null,"Apply the template and see the webhook in action. You can see that admission webhook denied the request on the last line."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'\u279c  kubectl apply -f cluster-test.yaml\ncluster.cluster.x-k8s.io/kubecon-eu created\nkubeadmcontrolplane.controlplane.cluster.x-k8s.io/kubecon-eu-control-plane created\ndockermachinetemplate.infrastructure.cluster.x-k8s.io/kubecon-eu-control-plane created\nmachinedeployment.cluster.x-k8s.io/kubecon-eu-md-0 created\ndockermachinetemplate.infrastructure.cluster.x-k8s.io/kubecon-eu-md-0 created\nkubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/kubecon-eu-md-0 created\nError from server (docker cluster name cannot be kubecon-eu): error when creating "cluster-test.yaml": admission webhook "vdockercluster.kb.io" denied the request: docker cluster name cannot be kubecon-eu\n')),(0,r.kt)("p",null,"Let's clean up."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"\u279c  kubectl delete -f cluster-test.yaml\n")),(0,r.kt)("hr",null),(0,r.kt)("h2",{id:"resource"},"Resource"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/"},"Dynamic Admission Control")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://book.kubebuilder.io/cronjob-tutorial/webhook-implementation.html"},"Implementing defaulting/validating webhooks"))))}d.isMDXComponent=!0}}]);