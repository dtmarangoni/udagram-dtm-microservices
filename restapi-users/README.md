# Udagram Users Backend REST API

A Node Express backend Users REST API refactored from monolith (second project of Udacity Cloud Developer Nanodegree) to microservices using docker containers.

This REST API communicates with the Ionic Front End through a reverse proxy, the Feed REST API and an AWS RDS database.

For the purpose of Postman testing, the expiration time of the user frontend token has been increased.

## Installation instructions

The app is deployed in the cloud with Kubernetes, but if you want to run it locally please the instructions below.

1. Requirements:

    - [Install Node.js](https://nodejs.org/en/) (tested with Node.Js 14);

2. Download and install the required npm packages: `npm i`
3. Add the necessary environment variables in the system
4. Run de dev server: `npm run dev`

## Reference

The backend monolith project is based in the Udacity repository below.

-   [Node Express Backend REST API](https://github.com/udacity/cloud-developer/tree/master/course-02/exercises/udacity-c2-restapi)
