import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

import { createUser, loginUser, logoutUser, authSuccess, deleteUser, changepwUser, authenticate } from './controller/user-controller.js';

const router = express.Router()

const port = process.env.ENV === "PROD" ? process.env.PORT : 8000

app.get('/', (_, res) => res.send('Hello World from user-service'))


const corsConfig = {
    credentials: true,
    origin: true
};
router.use(cors(corsConfig));
router.options('*', cors())
router.use(cookieParser())

// Controller will contain all the User-defined Routes
router.post('/', createUser)
router.post('/login', loginUser)
router.post('/logout', authenticate, logoutUser)
router.post('/delete', authenticate, deleteUser)
router.post('/changepw', authenticate, changepwUser)
router.post('/authenticate', authenticate, authSuccess)


app.use('/api/user', router).all((req, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
})


app.listen(port, () => console.log(`user-service listening on port ${port}`));

// Export our app for testing purposes
export default app;
