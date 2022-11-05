import { createUser, findUser, deleteUser, changePwUser, checkBlackList, createBlackList } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence

export async function ormCreateUser(params) {
    try {
        const newUser = await createUser(params);
        newUser.save();
        return true;
    } catch (err) {
        console.error(err);
        return { err };
    }
}

export async function ormSearchUser(params) {
    try {
        const user = await findUser(params)
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

export async function ormDeleteUser(params) {

    try {
        const user = await deleteUser(params)
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

export async function ormChangePwUser(searchParams, updateParams) {
    try {
        const user = await changePwUser(searchParams, updateParams)
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


export async function ormAddBlacklist(params) {
    try {
        params.createdAt = Date.now()
        const newBlacklist = await createBlackList(params);
        newBlacklist.save();
        return true;
    } catch (err) {
        console.error(err)
        return { err };
    }
}


export async function ormCheckValidToken(params) {
    try {
        const isInBlackList = await checkBlackList(params)
        if (isInBlackList) {
            throw new Error("Invalid Token!")
        }
        return true;
    } catch (err) {
        console.error(err)
        return { err };
    }
}



