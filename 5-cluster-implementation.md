# Implementing the cluster api/controller

**TODO: Quick recap on the contract / responsibility, then steps

1. Add a reference to the packages we need:

```shell
go get github.com/capi-samples/cluster-api-provider-docker/pkg
```

2. Edit `api/v1alpha1/dockercluster_types.go` and add a new field to allow overriding the default load balancer image:

```go
	// LoadBalancerImage allows you override the load balancer image. If not specified a
	// default image will be used.
	// +optional
	LoadBalancerImage string `json:"loadbalancerImage,omitempty"`
```

3. Update the generated code and manifests bu running:

```shell
make generate
make manifests
```

> You could also just run `make`
