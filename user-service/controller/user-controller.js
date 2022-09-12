import jwt from 'jsonwebtoken'
import { ormCreateUser as _createUser, ormLoginUser as _loginUser, ormSearchUser as _searchUser} from '../model/user-orm.js'


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
            const user = await _searchUser(username);
            const resp = await _loginUser(username, password);
            if (resp.err) {
                return res.status(409).json({message: 'Invalid credentials!'});
            } else {
                console.log(`Login successfully!`, user._id)
                return res.status(201).json({
                    token: generateToken(user._id),
                    message: `Login successfully!`
                });
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when logging in!'})
    }
}

export function generateToken(id) {
    //add SECRET_KEY in env file
    return jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: '1d',
    })
}