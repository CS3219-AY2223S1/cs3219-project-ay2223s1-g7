import UserModel from './user-model.js';
import BlackListModel from './blacklist-model.js';

import 'dotenv/config'


//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createUser(params) {
    return new UserModel(params)
}

export async function findUser(params) {
    return UserModel
        .findOne(params);
}

export async function deleteUser(params) {
    return UserModel
        .findOneAndDelete(params);
}

export async function changePwUser(searchParams, updateParams) {
    return UserModel
        .findOneAndUpdate(searchParams, { $set: updateParams }, { returnNewDocument: true });
}

export async function createBlackList(params) {
    return new BlackListModel(params)
}

export async function checkBlackList(params) {
    return BlackListModel
        .countDocuments(params, { limit: 1 })
        .then(num => {
            if (num > 0) {
                return true;
            }
            return false;
        });
}



