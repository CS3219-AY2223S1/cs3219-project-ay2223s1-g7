import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { createUser, loginUser, logoutUser, authUser, deleteUser, changepwUser} from './controller/user-controller.js';
import { Server } from 'socket.io'
import { createServer } from 'http';

const router = express.Router()


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


const httpServer = createServer(app)

const io = new Server(
    httpServer,
    {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    }
);

io.on('connection', (socket) => {
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit("callended");
    });

    socket.on("calluser", ({userToCall, signalData, from, name}) => {
        io.to(userToCall).emit("calluser", {signal: signalData, from, name});
    })

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    })
});

app.listen(8000, () => console.log('user-service listening on port 8000'));