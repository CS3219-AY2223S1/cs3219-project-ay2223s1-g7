import {
    ormCreateUser as _createUser, ormSearchUser as _searchUser, ormDeleteUser as _deleteUser,
    ormAddBlacklist as _addBlackList, ormChangePwUser as _changePwUser, ormCheckValidToken as _checkValidToken
} from '../model/user-orm.js'
import { generateJWT, verifyJWT } from '../utils/jwt.js'
import { hashPassword, verifyPassword } from '../utils/bcrypt.js'

const ONE_HR_IN_MS = 60 * 60 * 1000

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Username and/or Password are missing!' });

        let user = await _searchUser(username)
        if (!user.err) return res.status(409).json({ message: 'User already exists' })

        let hashedPassword = await hashPassword(password)
        const resp = await _createUser(username, hashedPassword);
        if (resp.err) return res.status(409).json({ message: 'Could not create a new user!' });

        console.log(`Created new user ${username} successfully!`)
        return res.status(201).json({ message: `Created new user ${username} successfully!` });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
}

export async function loginUser(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) return res.status(400).json({ message: 'Username and/or Password are missing!' });

        const user = await _searchUser(username)
        if (user.err) return res.status(400).json({ message: 'Invalid credentials' })

        let validPassword = await verifyPassword(password, user.password)
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials!' });

        const token = generateJWT({ username });
        if (token.err) return res.status(500).json({ message: 'Error generating token' });

        console.log(`Login successfully!`, username);
        res.cookie("token", token, { sameSite: "None", httpOnly: true, secure: true, maxAge: ONE_HR_IN_MS });

        return res.status(200).json({ message: `Login successfully!` });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
}


export async function logoutUser(req, res) {
    try {
        const token = req.cookies["token"];

        const resp = await _addBlackList(token);
        if (resp.err) return res.status(500).json({ message: 'Unable to add to blacklist' });

        res.cookie("token", "", { sameSite: "None", httpOnly: true, secure: true, maxAge: 0 })
        return res.status(200).json({ message: `Logout successful` });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'server error!' })
    }
}

export async function deleteUser(req, res) {
    try {
        const { username, _ } = req.userInfo
        const token = req.cookies["token"];

        const resp = await _addBlackList(token);
        if (resp.err) {
            return res.status(400).json({ message: 'Unable to add to blacklist' });
        }

        const deleteResp = await _deleteUser(username);
        if (deleteResp.err) {
            return res.status(400).json({ message: 'Unable to delete User' });
        }
        res.cookie("token", "", { sameSite: "None", httpOnly: true, secure: true, maxAge: 0 })
        return res.status(200).json({ message: `Delete successful` });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
}

export async function changepwUser(req, res) {
    try {
        const { username, password } = req.userInfo
        const { oldPassword, newPassword } = req.body;
        const token = req.cookies["token"];

        if (!username || !oldPassword || !newPassword) return res.status(400).json({ message: 'Missing information!' });

        let validPassword = await verifyPassword(oldPassword, password)
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials!' });

        const blacklistResp = await _addBlackList(token);
        if (blacklistResp.err) return res.status(500).json({ message: 'Unable to add to blacklist' });

        res.cookie("token", "", { sameSite: "None", httpOnly: true, secure: true, maxAge: 0 })

        const hashedPassword = await hashPassword(newPassword)
        const changeResp = await _changePwUser(username, hashedPassword);
        if (changeResp.err) return res.status(500).json({ message: 'Unable to change password' });

        console.log(`Change password successfully!`, username);
        return res.status(200).json({ message: `Change password successfully!` });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
}


export async function authSuccess(req, res) {
    return res.status(200).json({ message: `Authentication successful` });
}


export async function authenticate(req, res, next) {
    try {
        const token = req.cookies["token"];
        if (!token) throw new Error("No token provided")

        const user = verifyJWT(token);
        if (user.err) throw new Error("Invalid Token")
        const username = user.username

        const resp = await _checkValidToken(token)
        if (resp.err) throw new Error("Invalid Token")

        let userInDb = await _searchUser(username)
        if (userInDb.err) throw new Error("Invalid Token")
        const password = userInDb.password

        req.userInfo = { username, password }

        next()
    } catch (err) {
        res.cookie("token", "", { sameSite: "None", httpOnly: true, secure: true, maxAge: 0 })
        return res.status(401).json({ message: 'Authentication failed' })
    }
}
