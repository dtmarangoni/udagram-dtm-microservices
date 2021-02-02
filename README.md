# Udagram Microservices

This is the Udagram, second project of Udacity Cloud Developer Nanodegree, refactored from monolith to microservices using Docker containers and CI/CD pipelines with Travis and Kubernetes.

Users will be able to post photos to a feed and process it using an image filtering.

These are the components that compose the complete solution:

-   A Kubernetes cluster deployed in AWS containing:
    -   An Ionic frontend UI on it's own pod/container;
    -   A Node-Express backend REST API for user endpoint on it's own pod/container;
    -   A Node-Express backend REST API for feed endpoint on it's own pod/container;
    -   A reverse proxy sitting in front of the REST APIs;
    -   A Node-Express image filtering microservice on it's own pod/container;
-   AWS S3 file store;
-   AWS RDS database;

The Ionic frontend consumes the Node-Express REST APIs through the reverse-proxy API Gateway.

The REST APIs communicates with the Ionic Frontend, a S3 file store, the RDS database and with the image filtering microservice.

## Screenshots

As per Udacity project evaluation a screenshots folder was created containing all required images of each step of a working project.

## Kubernetes Configuration Files

The Kubernetes application configuration files are located in kubernetes folder in project root.

-   k8s.udagram-dtm.yml - specifies all application services and deployments;
-   k8s.configMap.yml - a k8s ConfigMap containing the project environment variables;
-   k8s.secrets.yml - a k8s secrets containing the project sensitive environment variables;
-   k8s.autoscaler.yml - the horizontal pod autoscaler configuration file;
-   k8s.networkPolicy.yml - the ingress network policy for all required pods in the application;

## Current Frontend Endpoint

Current Kubernetes Ionic frontend endpoint: [Udagram Microservices](http://af83ec67a710241739dab4fb7a886dbd-1117012392.sa-east-1.elb.amazonaws.com/home).

## Installation instructions

The project is deployed in the AWS cloud, but if you want to try by your own please check the instructions below.

1. Requirements:

    - A provisioned AWS S3 file store;
    - A provisioned AWS RDS PostgreSQL database;
    - [Install Node.js](https://nodejs.org/en/) (tested with Node.Js 14);
    - [Install AWS cli](https://aws.amazon.com/cli/);
    - [Install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/);

2. Create an AWS IAM profile or use an existing one for this project;
3. Create an EKS Cluster in AWS with the chosen IAM profile.

    - The cluster can be created with a different IAM profile than the actual user that will access and use it. In this case additional steps should be taken. Reference - [Managing users or IAM roles for your cluster - To add an IAM user or role to an Amazon EKS cluster section](https://docs.aws.amazon.com/eks/latest/userguide/add-user-role.html);
        - configure the IAM user who created the cluster locally with aws configure;
        - use this user to edit the aws-auth ConfigMap
        - add the IAM user who will work in the cluster afterwards inside the aws-auth mapUsers section of the ConfigMap;

4. Create a Node Group inside the EKS Cluster with the chosen IAM profile;
5. Update the IAM profile to have access to EKS resources;
6. [Configure your local AWS profile with the IAM to be used for this project](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html);
7. [Tie the kubectl cli to your created AWS cluster](https://docs.aws.amazon.com/pt_br/eks/latest/userguide/getting-started-console.html#eks-configure-kubectl);
8. [Create your k8s.secrets.yml](https://kubernetes.io/docs/tasks/configmap-secret/managing-secret-using-config-file/) inside kubernetes folder. This secrets should contain the sensitive environment variables necessary to the project:

    - RESTAPI_FEED_CLIENT_ID - restapi server client id for server-server jwt token authentication;
    - RESTAPI_FEED_PRIVATE_KEY - restapi server private key for server-server jwt token authentication;
    - IMG_JWT_SECRET - image filtering microservice secret to generate the jwt server-server access token;
    - POSTGRESS_USERNAME - AWS RDS database username;
    - POSTGRESS_PASSWORD - AWS RDS database password;
    - POSTGRESS_DATABASE - AWS RDS database db name;
    - POSTGRESS_HOST - AWS RDS database host address;
    - JWT_SECRET - secret to generate the jwt authorization token for frontend;
    - AWS_REGION - AWS deployed resources region;
    - AWS_PROFILE - AWS IAM profile that has permissions to the project resources;
    - AWS_MEDIA_BUCKET - AWS S3 bucket endpoint.

9. To deploy all components in EKS run the command in your terminal:
    - `npm run udagram-dtm`
10. Get the reverse-proxy external IP:
    - `kubectl get service -l app=reverse-proxy`
11. Update the frontend environment.prod.ts API host with the reverse-proxy external IP;
12. Update the git repository with the new code and trigger Travis CI process;
13. Update kubernetes frontend pod with the latest image;
14. Get your frontend endpoint and access the Udagram app from the browser:
    - `kubectl get service -l app=frontend-ionic`
