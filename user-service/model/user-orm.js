import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { checkUserInDatabase, createUser, findUser } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {

    try {
        const isInDb = await checkUserInDatabase(username) 
        if (isInDb ) {
            throw new Error("Duplicate user")
        }
        //Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await createUser({username, password: hashedPassword});
        newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export async function ormSearchUser(username) {

    try {
        const user = await findUser(username) 
        console.log("SD", user)
        if (user) {
            return user;
        } else {
            throw new Error("Missing user")
        }
     
    } catch (err) {
        console.log('ERROR: Could not find User');
        return { err };
    }
}

export async function ormLoginUser(username, password) {

    try {
        const user = await findUser(username) 
        if (user && (await bcrypt.compare(password, user.password))) {
            return true;
        } else {
            throw new Error("Invalid credentials")
        }        
    } catch (err) {
        console.log('ERROR: Could not login');
        return { err };
    }
}

