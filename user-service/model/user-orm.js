import { createUser, findUser, deleteUser, changePwUser, checkBlackList, createBlackList } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence

export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({ username, password });
        newUser.save();
        return true;
    } catch (err) {
        console.error(err);
        return { err };
    }
}

export async function ormSearchUser(username) {
    try {
        const user = await findUser({ username })
        if (user) {
            return user;
        } else {
            throw new Error("Missing user")
        }
    } catch (err) {
        console.error(err);
        return { err };
    }
}

export async function ormDeleteUser(username) {

    try {
        const user = await deleteUser({ username })
        if (user) {
            return true;
        } else {
            throw new Error("Invalid deletion")
        }
    } catch (err) {
        console.error(err)
        return { err };
    }
}

export async function ormChangePwUser(username, password) {
    try {
        const user = await changePwUser({ username }, { password })
        if (user) {
            return true;
        } else {
            throw new Error("Invalid password change")
        }
    } catch (err) {
        console.error(err)
        return { err };
    }
}


export async function ormAddBlacklist(jwt_token) {
    try {
        const newBlacklist = await createBlackList({ jwt_token, createdAt: Date.now() });
        newBlacklist.save();
        return true;
    } catch (err) {
        console.error(err)
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
        console.error(err)
        return { err };
    }
}



