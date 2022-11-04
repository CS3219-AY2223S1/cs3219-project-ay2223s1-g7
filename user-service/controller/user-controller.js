import {
    ormCreateUser as _createUser, ormLoginUser as _loginUser, ormSearchUser as _searchUser, ormDeleteUser as _deleteUser,
    ormIssueJWT as _issueJWT, ormAddBlacklist as _addBlackList, ormChangePwUser as _changepwUser, ormCheckValidToken as _checkValidToken
} from '../model/user-orm.js'

const ONE_HR_IN_MS = 60 * 60 * 1000

export async function createUser(req, res) {
    try {
        // for testing deployment
        let userTest = req.cookies["user"];
        console.log(`user cookie ${userTest}`)

        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            if (resp.err) {
                return res.status(409).json({ message: 'Could not create a new user!' });
            } else {
                console.log(`Created new user ${username} successfully!`)

                return res.status(201).json({ message: `Created new user ${username} successfully!` });
            }
        } else {
            return res.status(400).json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Database failure when creating new user!' })
    }
}

export async function loginUser(req, res) {
    try {
        const { username, password } = req.body;

        if (username && password) {
            const resp = await _loginUser(username, password);
            if (resp.err) {
                return res.status(409).json({ message: 'Invalid credentials!' });
            } else {

                const token = await _issueJWT(username);


                if (token.err) {
                    return res.status(409).json({ message: 'Token already exists' });
                } else {
                    console.log(`Login successfully!`, username);
                    res.cookie("token", token, { sameSite: "None", httpOnly: true, secure: true, maxAge: ONE_HR_IN_MS });

                    return res.status(200).json({
                        message: `Login successfully!`
                    });
                }
            }
        } else {
            return res.status(400).json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Database failure when logging in!' })
    }
}


export async function logoutUser(req, res) {
    try {
        let token = req.cookies["token"];

        const resp = await _addBlackList(token);
        if (resp.err) {
            return res.status(409).json({ message: 'Unable to add to blacklist' });
        } else {
            res.cookie("token", "", { httpOnly: true, maxAge: 0 })
            return res.status(200).json({ message: `Logout successful` });
        }

    } catch (err) {
        return res.status(500).json({ message: 'Database failure when logging in!' })
    }
}

export async function deleteUser(req, res) {
    try {
        const { username } = req.body;
        let token = req.cookies["token"];

        const resp = await _addBlackList(token);
        if (resp.err) {
            return res.status(409).json({ message: 'Unable to add to blacklist' });
        }

        const deleteResp = await _deleteUser(username);
        if (deleteResp.err) {
            return res.status(409).json({ message: 'Unable to delete User' });
        }
        res.cookie("token", "", { httpOnly: true, maxAge: 0 })
        return res.status(200).json({ message: `Delete successful` });

    } catch (err) {
        return res.status(500).json({ message: 'Database failure when logging in!' })
    }
}

export async function changepwUser(req, res) {
    try {
        const { username, oldPassword, newPassword } = req.body;
        let token = req.cookies["token"];
        if (username && oldPassword && newPassword) {
            const resp = await _loginUser(username, oldPassword);
            if (resp.err) {
                return res.status(409).json({ message: 'Invalid credentials!' });
            } else {
                const blacklistResp = await _addBlackList(token);
                if (blacklistResp.err) {
                    return res.status(409).json({ message: 'Unable to add to blacklist' });
                }
                res.cookie("token", "", { httpOnly: true, maxAge: 0 })
                const changeResp = await _changepwUser(username, newPassword);
                if (changeResp.err) {
                    return res.status(409).json({ message: 'Unable to change password' });
                } else {
                    console.log(`Change password successfully!`, username);
                    return res.status(200).json({
                        message: `Change password successfully!`
                    });
                }
            }
        } else {
            return res.status(400).json({ message: 'Missing information!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Database failure when logging in!' })
    }
}


export async function authUser(req, res) {
    try {
        let token = req.cookies["token"];
        // for testing deployment
        console.log(`token cookie ${token}`)
        
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }
        await _checkValidToken(token);
        return res.status(200).json({ message: `Login successful` });

    } catch (err) {
        console.log("Invalid Authentication")

        return res.status(409).json({ message: 'Invalid Token' });
    }
}

