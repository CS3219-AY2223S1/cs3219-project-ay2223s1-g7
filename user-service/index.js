import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { createUser, loginUser, logoutUser, authUser, deleteUser, changepwUser} from './controller/user-controller.js';

const router = express.Router()

const port = process.env.ENV === "PROD" ? process.env.PORT : 8000


// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'))
router.post('/', createUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/delete', deleteUser)
router.post('/changepw', changepwUser)
router.post('/authenticate', authUser)



app.use('/api/user', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

app.listen(port, () => console.log(`user-service listening on port ${port}`));

// Export our app for testing purposes
export default app;
