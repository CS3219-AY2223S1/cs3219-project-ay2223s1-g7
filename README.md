# CS3219-AY22-23-Project-Skeleton

This is the repository for CS3219 project. Below are the deployed and local setup.

## Deployed
Visit the links and trust the certificates:
- https://matserv-env.eba-ei3vpcg2.ap-southeast-1.elasticbeanstalk.com/ 
- https://userservice-env.eba-p3j8behu.ap-southeast-1.elasticbeanstalk.com/ 
- https://webserv-env.eba-jwtv3m3g.ap-southeast-1.elasticbeanstalk.com/
- https://collab-env.eba-jd3df2b9.ap-southeast-1.elasticbeanstalk.com/
- https://quessvc-env.eba-2agrnkqm.ap-southeast-1.elasticbeanstalk.com/ 

Frontend:
https://dj17yv8d2l9t3.cloudfront.net/




## Local
Apply this to the different sub-folders
 - collaboration-service
 - matching-service
 - question-service
 - user-service
 - webcam-service
1. Create `.env` file
2. Create a Cloud DB URL using Mongo Atlas (Only need to do this once)

In the `.env` file, copy and paste the following and replace the Cloud DB URL:

ENV=DEV

DB_LOCAL_URI={your_url}

3. For user-service, add an additional attribute in `.env` file

SECRET_KEY ={anything that you want}

4. Install npm packages for the respective services using `npm i`.
5. Run the respective services using `npm run dev`.

In the frontend sub-folder
1. Install npm packages for the respective services using `npm i`.
2. Run `npm start`.

## Before running any sub-folder
1. Run a redis server locally

https://tableplus.com/blog/2018/10/how-to-start-stop-restart-redis.html
