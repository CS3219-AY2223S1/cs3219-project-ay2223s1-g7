# CS3219-AY22-23-Project-Skeleton

This is a template repository for CS3219 project.

## Apply this to the different sub-folders
 - collaboration-service
 - frontend
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

## Before running
1. Run a redis server locally

https://tableplus.com/blog/2018/10/how-to-start-stop-restart-redis.html