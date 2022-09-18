import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { connectMatch } from './controller/match-controller.js';
import { Server } from 'socket.io'

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from matching-service');
});

const httpServer = createServer(app)

const io = new Server(
    httpServer, { 
        cors: { 
            origin: "*", 
            credentials: true
        } 
    }
);

io.on('connection', async (socket) => {
    let query = socket.handshake.query
    console.log(`A user connected ${socket.id} ${query.username} ${query.difficulty}`)
    let roomName = await connectMatch(socket, query.username, query.difficulty)
    socket.join(roomName)

    socket.on('send_message', (data) => {
        io.to(roomName).emit("received_message", data);
    })
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', () => {
        console.log('A user disconnected')
    })
})

httpServer.listen(8001);
