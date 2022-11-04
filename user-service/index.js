import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(cors()) // config cors so that front-end can use
// app.options('*', cors())

const whitelist = process.env.ORIGIN ? [process.env.ORIGIN] : []

const corsConfig = {
    credentials: true,
    origin: function (origin, callback) {
        if (whitelist.length === 0 || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};
app.use(cors(corsConfig));
app.use(cookieParser())
import { createUser, loginUser, logoutUser, authUser, deleteUser, changepwUser } from './controller/user-controller.js';

const router = express.Router()

const port = process.env.ENV === "PROD" ? process.env.PORT : 8000

app.get('/', (_, res) => res.send('Hello World from user-service'))


// Controller will contain all the User-defined Routes
router.post('/', createUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/delete', deleteUser)
router.post('/changepw', changepwUser)
router.post('/authenticate', authUser)

app.use('/api/user', router).all((req, res) => {
    console.log(req.headers.origin)
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    // res.setHeader('Access-Control-Allow-Credentials', true)
})



app.listen(port, () => console.log(`user-service listening on port ${port}`));

// Export our app for testing purposes
export default app;
