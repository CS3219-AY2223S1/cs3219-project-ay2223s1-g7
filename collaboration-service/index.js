import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io'
import { DocumentHistory } from './document-history.js'

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from collaboration-service');
});

// TODO: add cookie parser to get roomname and some other info

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

// map of documents for each room
const documentMap = new Map()

io.on('connection', async (socket) => {
    let query = socket.handshake.query

    // TODO: possible to use uuid to validate room name 
    if (query.username.length === 0 || query.roomName.length === 0) {
        console.log("missing username and/or roomName")
        socket.disconnect()
        return
    }
    socket.emit("connectSuccess")

    let roomName = query.roomName

    console.log(`A user connected ${socket.id} ${query.username} ${roomName}`)

    socket.join(roomName)

    // send everyone's usernames in the room
    let sockets = await io.in(roomName).fetchSockets();
    let users = sockets.map(socket => socket.handshake.query.username)
    console.log(users)
    io.to(roomName).emit("joinRoomSuccess", { users })

    let document = documentMap.get(roomName)
    if (typeof document === "undefined") {
        document = new DocumentHistory(roomName)
        documentMap.set(roomName, document)
    }

    socket.on("pushUpdates", (data, callback) => {
        document.pushUpdates(data, callback)
    });

    socket.on("pullUpdates", (data, callback) => {
        document.pullUpdates(data, callback)
    });

    socket.on("getDocument", (callback) => {
        document.getDocument(callback)
    })

    socket.on('disconnect', () => {
        if (io.sockets.adapter.rooms.get(roomName)?.size === 1) {
            socket.broadcast.to(roomName).emit("collaborator_left");
        }
        console.log('A user disconnected')
    })
})

httpServer.listen(8002);
