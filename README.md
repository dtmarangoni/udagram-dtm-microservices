# Udagram Microservices

    PROJECT IN PROGRESS

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

For more details on which implementation and changes according to the project specification, please visit the README of each application in it's sub-folder.
