# Udagram Backend REST API

A Node Express backend REST API from second project of Udacity Cloud Developer Nanodegree.

The REST API communicates with the Ionic Front End, an AWS S3 file store, an AWS RDS database and an image filtering microservice.

This is how the flow between the REST API and the image microservice was implemented:

1. User sends a new feed post from the Ionic frontend to the backend REST API containing the image name and the caption. At this point, the frontend has already uploaded the image file to AWS S3;
2. REST API generates a new public signed url to the image file from AWS S3;
3. REST API generates a new client id token with which it asks for an access token from the image microservice;
4. With the access token and the public url, it reaches the microservice image filtering endpoint;
5. The image microservice downloads the image from the public url, filter it and returns the file to the REST API;
6. REST API generates a signed put url from AWS S3 to upload the filtered image file to S3;
7. The AWS RDS DB is updated with the new post feed;
8. The new feed is returned to frontend with the public signed url to update the page.

For the purpose of Postman testing, the expiration time of the user frontend token has been increased.

## Installation instructions

The app is deployed in the cloud, but if you want to run it locally please the instructions below.

1. Requirements:

    - [Install Node.js](https://nodejs.org/en/) (tested with Node.Js 14);

2. Download and install the required npm packages: `npm i`
3. Run de dev server: `npm run dev`

## Reference

This backend is based in the Udacity repository below. Please check it for detailed installation instructions.

-   [Node Express Backend REST API](https://github.com/udacity/cloud-developer/tree/master/course-02/exercises/udacity-c2-restapi)
