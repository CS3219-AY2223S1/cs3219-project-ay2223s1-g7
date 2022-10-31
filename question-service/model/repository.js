import QuestionModel from './question-model.js';

import 'dotenv/config'


//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createQuestion(params) { 
  return new QuestionModel(params)
}

export async function checkQuestionInDatabase(inputTitle) { 
  return db.collection("questionmodels")
    .countDocuments( { title: inputTitle } )
    .then(num => {
      if (num > 0) {
        return true;
      }  
      return false;
    });
}

export async function findQuestionByTitle(inputTitle) { 
  return db.collection("questionmodels")
    .findOne( { title: inputTitle } );
}

export async function findQuestionByDifficulty(inputDifficulty, userOne, userTwo) {
    return db.collection("questionmodels")
    .findOne( { difficulty: inputDifficulty , 
      attempts: {$nin: [userOne, userTwo]} });
}

export async function findAllQuestionByDifficulty(inputDifficulty) {
  
    return db.collection("questionmodels")
    .find( { difficulty: inputDifficulty } ).toArray();
}

export async function deleteQuestion(inputTitle) { 
  return db.collection("questionmodels")
    .findOneAndDelete( { title: inputTitle } );
}

export async function findAllQuestionAttempted(user) {
  
  return db.collection("questionmodels")
  .find( { attempts: user } ).toArray();
}








