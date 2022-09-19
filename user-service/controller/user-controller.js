import { ormCreateUser as _createUser, ormLoginUser as _loginUser, ormSearchUser as _searchUser, ormDeleteUser as _deleteUser,
    ormIssueJWT as _issueJWT, ormAddBlacklist as _addBlackList, ormCheckValidToken as _checkValidToken} from '../model/user-orm.js'


export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            if (resp.err) {
                return res.status(409).json({message: 'Could not create a new user!'});
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({message: `Created new user ${username} successfully!`});
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
    }
}

export async function loginUser(req, res) {
    try {
        const { username, password } = req.body;

        if (username && password) {
            const resp = await _loginUser(username, password);
            if (resp.err) {
                return res.status(409).json({message: 'Invalid credentials!'});
            } else {

                const token = await _issueJWT(username);
                if (token.err) {
                    return res.status(409).json({message: 'Token already exists'});
                } else {
                    console.log(`Login successfully!`, username);
                    return res.status(201).json({
                        token: token,
                        message: `Login successfully!`
                    });                
                }                
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when logging in!'})
    }
}


export async function logoutUser(req, res) {
    try {
        const {token} = req.body;

        const resp = await _addBlackList(token);
        if (resp.err) {
            return res.status(409).json({message: 'Unable to add to blacklist'});
        } else {
            return res.status(200).json({message: `Logout successful`});
        }
  
    } catch (err) {
       return res.status(500).json({message: 'Database failure when logging in!'})
    }
}

export async function deleteUser(req, res) {
    try {
        const {username, token} = req.body;

        const resp = await _addBlackList(token);
        if (resp.err) {
            return res.status(409).json({message: 'Unable to add to blacklist'});
        }

        const deleteResp = await _deleteUser(username);
        if (deleteResp.err) {
            return res.status(409).json({message: 'Unable to delete User'});
        }

        return res.status(200).json({message: `Delete successful`});
  
    } catch (err) {
       return res.status(500).json({message: 'Database failure when logging in!'})
    }
}


export async function authUser(req, res) {
    try {
        const {token} = req.body;
        console.log("TEST AUTH")

        if (!token) {
            return res.status(409).json({message: 'No token provided'});
        } 
        const resp = await _checkValidToken(token);
        if (resp.err) {

            return res.status(409).json({message: 'Invalid Token'});
        } else {
            return res.status(200).json({message: `Login successful`});
        } 
    } catch (err) {
        return res.status(500).json({message: 'Database failure when logging in!'})
    }
}



