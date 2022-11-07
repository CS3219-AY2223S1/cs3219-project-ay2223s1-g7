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
        path: '/api/match',
        cors: {
            origin: "*",
        }
    }
);

const port = process.env.ENV === "PROD" ? process.env.PORT : 8001

io.on('connection', (socket) => {
    const query = socket.handshake.query
    if (!query.username || !query.difficulty) {
        console.error("missing username and/or difficulty")
        socket.disconnect()
        return
    }

    console.log(`A user connected ${socket.id} ${query.username} ${query.difficulty}`)

    let timer = null

    const joinRoom = (roomName) => {
        socket.join(roomName)
        timer = setTimeout(async () => {
            let roomSize = io.sockets.adapter.rooms.get(roomName)?.size
            if (!isNaN(roomSize) && roomSize < 2) {
                console.error("failed to match")
                io.to(roomName).emit("matchFail")
                removeMatch(query.difficulty)
            }
        }, 30000);
    }

    const sendMatchSuccess = (roomName) => {
        if (io.sockets.adapter.rooms.get(roomName)?.size === 2) {
            io.to(roomName).emit("matchSuccess", roomName)
        }
    }

    connectMatch(joinRoom, sendMatchSuccess, query.username, query.difficulty)

    socket.on('disconnect', () => {
        removeMatch(query.difficulty)
        if (timer) {
            clearTimeout(timer)
        }
        console.log(`${query.username} disconnected`)
    })
})

httpServer.listen(port, () => console.log(`matching-service listening on port ${port}`));

// Export our app for testing purposes
export default io;