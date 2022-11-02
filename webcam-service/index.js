import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io'

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from webcam-service');
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
    let users = sockets.map(socket => ({ name: socket.handshake.query.username }))
    if (users.length == 2) {
        io.to(roomName).emit("joinRoomSuccess", { users })
    }

    socket.on('endCall', () => {
        console.log(`${query.username} ending call`)
        io.to(roomName).emit("callended")
    });
    
    socket.on("calluser", ({ signalData }) => {
        console.log(`${query.username} calling`)
        socket.to(roomName).emit("calluser", { signal: signalData });
    })

    socket.on("answercall", (data) => {
        console.log(`${query.username} answering`)
        socket.to(roomName).emit("callaccepted", data.signal);
    })

    socket.on("rejectCall", () => {
        socket.to(roomName).emit("rejectCall");
    })

    socket.on("disconnect", (data) => {
        console.log(`A user disconnected ${socket.id} ${query.username} ${roomName}`)
    })
});

httpServer.listen(8004);
