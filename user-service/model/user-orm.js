import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { checkUserInDatabase, createUser, findUser, deleteUser, changepwUser, checkBlackList, createBlackList} from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {

    try {
        const isInDb = await checkUserInDatabase(username) 
        if (isInDb ) {
            throw new Error("Duplicate user")
        }
        //Hash password
        const saltRounds = 10; // Increase according to alloted processing time, saw 20k as recommended
        const hashedPassword = await bcrypt.hash(password, saltRounds)

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

export async function ormDeleteUser(username) {

    try {
        const user = await deleteUser(username) 
        if (user) {
            return true;
        } else {
            throw new Error("Invalid deletion")
        }        
    } catch (err) {
        console.log('ERROR: Could not login');
        return { err };
    }
}

export async function ormChangePwUser(username, newPassword) {

    try {
         //Hash password
         const saltRounds = 10; // Increase according to alloted processing time, saw 20k as recommended
         const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
        const user = await changepwUser(username, hashedPassword) 
        if (user) {
            return true;
        } else {
            throw new Error("Invalid password change")
        }        
    } catch (err) {
        console.log('ERROR: Could not change password');
        return { err };
    }
}


export async function ormIssueJWT(username) {
    try {
        const token = await generateJWT(username)
        return token;
    } catch (err) {
        console.log('ERROR: Could not generate JWT');
        return { err };
    }
}


export async function ormAddBlacklist(token) {
    try {
        if(!await checkBlackList(token)){
            const newBlacklist = await createBlackList({jwt_token: token, createdAt: Date.now()});
            newBlacklist.save();
            return true;
        }
    } catch (err) {
        console.log('ERROR: Could not add to blacklist!');
        return { err };
    }
}


export async function ormCheckValidToken(token) {
    try {

        const isInBlackList = await checkBlackList(token)

        if(isInBlackList){
            throw new Error("Invalid Token!")
        }

        jwt.verify(token, process.env.SECRET_KEY)

        return true;
    } catch (err) {
        throw new Error("Invalid Token!")
    }
}

async function generateJWT(username) {
    return jwt.sign({username}, process.env.SECRET_KEY, { algorithm: 'HS256',  expiresIn: '1h'});
}



  
