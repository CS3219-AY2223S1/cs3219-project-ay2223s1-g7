import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io'

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from collaboration-service');
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

io.on('connection', async (socket) => {
    let query = socket.handshake.query

    if (query.username.length === 0 || query.roomName.length === 0) {
        console.log("missing username and/or roomName")
        socket.disconnect()
        return
    }
    let roomName = query.roomName

    console.log(`A user connected ${socket.id} ${query.username} ${roomName}`)

    socket.join(roomName)

    // send everyone's usernames in the room
    let sockets = await io.in(roomName).fetchSockets();
    console.log(sockets)
    let users = sockets.map(socket => socket.handshake.query.username)
    console.log(users)
    io.to(roomName).emit("joinRoomSuccess", { users })

    socket.on('send_message', (data) => {
        io.to(roomName).emit("received_message", data);
    })

    socket.on('send_cursor_pos', (data) => {
        io.to(roomName).emit("received_cursor_pos", data);
    })

    socket.on('disconnect', () => {
        if (io.sockets.adapter.rooms.get(roomName)?.size === 1) {
            io.to(roomName).emit("collaborator_left");
        }
        console.log('A user disconnected')
    })
})

httpServer.listen(8002);
