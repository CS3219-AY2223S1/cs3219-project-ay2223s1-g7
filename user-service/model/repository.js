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

export async function checkUserInDatabase(inputUsername) {
    return UserModel
        .countDocuments({ username: inputUsername })
        .then(num => {
            if (num > 0) {
                return true;
            }
            return false;
        });
}

export async function findUser(inputUsername) {
    return UserModel
        .findOne({ username: inputUsername });
}

export async function deleteUser(inputUsername) {
    return UserModel
        .findOneAndDelete({ username: inputUsername });
}

export async function changepwUser(inputUsername, newPassword) {
    return UserModel
        .findOneAndUpdate({ username: inputUsername }, { $set: { password: newPassword } }, { returnNewDocument: true });
}

export async function createBlackList(params) {
    return new BlackListModel(params)
}

export async function checkBlackList(token) {
    return BlackListModel
        .countDocuments({ jwt_token: token }, { limit: 1 })
        .then(num => {
            if (num > 0) {
                return true;
            }
            return false;
        });
}



