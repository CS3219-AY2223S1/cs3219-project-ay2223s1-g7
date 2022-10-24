import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io'
import { connectMatch, removeMatch } from './controller/match-controller.js';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from matching-service');
});

const httpServer = createServer(app)

const io = new Server(
    httpServer,
    {
        cors: {
            origin: "*",
            credentials: true
        }
    }
);


io.on('connection', (socket) => {
    let query = socket.handshake.query
    if (typeof query.username === "undefined" || typeof query.difficulty === "undefined" || query.username.length === 0 || query.difficulty.length === 0) {
        // can check for valid username or difficulty
        console.log("missing username and/or difficulty")
        socket.disconnect()
        return
    }
    console.log(`A user connected ${socket.id} ${query.username} ${query.difficulty}`)

    let timer = null

    let sendMatchFail = (roomName) => {
        if (io.sockets.adapter.rooms.get(roomName)?.size < 2) {
            console.log("failed to match")
            io.to(roomName).emit("matchFail")
        }
    }
    let joinRoom = (roomName) => {
        socket.join(roomName)
        timer = setTimeout(async () => {
            let roomSize = io.sockets.adapter.rooms.get(roomName)?.size
            if (!isNaN(roomSize) && roomSize < 2) {
                sendMatchFail(roomName)
                removeMatch(query.username, query.difficulty)
            }
        }, 30000);
    }

    let setUpMessage = (roomName) => {
        console.log("reach here")
        if (io.sockets.adapter.rooms.get(roomName)?.size === 2) {
            io.to(roomName).emit("matchSuccess", roomName)
        }
    }

    connectMatch(joinRoom, setUpMessage, query.username, query.difficulty)

    socket.on('disconnect', () => {
        removeMatch(query.username, query.difficulty)
        if (timer) {
            clearTimeout(timer)
        }
        console.log(`${query.username} disconnected`)
    })
})

httpServer.listen(8001);

// Export our app for testing purposes
export default io;