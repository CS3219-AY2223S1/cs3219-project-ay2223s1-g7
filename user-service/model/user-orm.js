import { checkUserInDatabase, createUser, findUser, deleteUser, changepwUser, checkBlackList, createBlackList } from './repository.js';
import { verifyPassword } from '../utils/bcrypt.js'

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const isInDb = await checkUserInDatabase(username)
        if (isInDb) {
            throw new Error("Duplicate user")
        }
        const newUser = await createUser({ username, password });
        newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export async function ormSearchUser(username) {

    try {
        const user = await findUser({username})
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
        const user = await findUser({username})
        if (user && (await verifyPassword(password, user.password))) {
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
        const user = await deleteUser({username})
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

export async function ormChangePwUser(username, hashedPassword) {

    try {
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


export async function ormAddBlacklist(jwt_token) {
    try {
        if (!await checkBlackList({ jwt_token })) {
            const newBlacklist = await createBlackList({ jwt_token, createdAt: Date.now() });
            newBlacklist.save();
            return true;
        }
    } catch (err) {
        console.log('ERROR: Could not add to blacklist!');
        return { err };
    }
}


export async function ormCheckValidToken(jwt_token) {
    try {
        const isInBlackList = await checkBlackList({ jwt_token })
        if (isInBlackList) {
            throw new Error("Invalid Token!")
        }
        return true;
    } catch (err) {
        throw new Error("Invalid Token!")
    }
}



