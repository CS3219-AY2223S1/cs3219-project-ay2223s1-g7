import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { connectMatch, removeMatch } from './controller/match-controller.js';
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

function deleteRoom(roomName) {
    if (io.sockets.adapter.rooms.get(roomName)?.size < 2) {
        console.log("failed to match")
        io.to(roomName).emit("matchFail")
    }
}


io.on('connection', async (socket) => {
    let query = socket.handshake.query
    if (query.username.length == 0 || query.difficulty.length == 0) {
        console.log("missing username and/or difficulty")
        socket.disconnect()
        return
    }
    console.log(`A user connected ${socket.id} ${query.username} ${query.difficulty}`)
    
    let joinRoom = (roomName) => {
        socket.join(roomName)
    }

    let setUpMessage = (roomName) => {
        if (io.sockets.adapter.rooms.get(roomName)?.size == 2) {
            io.to(roomName).emit("matchSuccess", roomName)
        }
        socket.on('send_message', (data) => {
            io.to(roomName).emit("received_message", data);
        })
    }

    await connectMatch(deleteRoom, joinRoom, setUpMessage, query.username, query.difficulty)

    socket.on('disconnect', () => {
        removeMatch(query.username, query.difficulty)
        console.log('A user disconnected')
    })
})

httpServer.listen(8001);
