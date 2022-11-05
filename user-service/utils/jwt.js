import jwt from 'jsonwebtoken';


const SECRET_KEY = process.env.SECRET_KEY

export function generateJWT(payload) {
    try {
        return jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256', expiresIn: '1h' });
    } catch (err) {
        console.log('ERROR: Could not generate JWT');
        return { err };
    }
}

export function verifyJWT(token) {
    try {
        // returns token payload
        return jwt.verify(token, SECRET_KEY)
    } catch (err) {
        console.log('ERROR: invalid JWT token');
        return { err };
    }
}