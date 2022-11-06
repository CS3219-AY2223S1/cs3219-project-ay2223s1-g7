import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io'
import { validate as uuidValidate } from 'uuid'

import { DocumentHistory } from './document-history.js'

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from collaboration-service');
});


const port = process.env.ENV === "PROD" ? process.env.PORT : 8002

const httpServer = createServer(app)

const io = new Server(
    httpServer,
    {
        cors: {
            origin: "*",
        }
    }
);


// map of documents for each room
const documentMap = new Map()

io.on('connection', async (socket) => {
    let query = socket.handshake.query

    if (!query.username || !query.roomName) {
        console.log("missing username and/or roomName")
        socket.disconnect()
        return
    }

    let roomName = query.roomName

    if (uuidValidate(roomName.split("-")[1])) {
        console.log("invalid roomname")
        socket.disconnect()
        return
    }

    let document = documentMap.get(roomName)
    if (!document) {
        document = new DocumentHistory(roomName)
        documentMap.set(roomName, document)
    }

    socket.emit("connectSuccess")

    console.log(`A user connected ${socket.id} ${query.username} ${roomName}`)

    socket.join(roomName)

    // send everyone's usernames in the room
    let sockets = await io.in(roomName).fetchSockets();
    let users = sockets.map(socket => socket.handshake.query.username)
    if (users.length === 2) {
        io.to(roomName).emit("joinRoomSuccess", { users })
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
        console.log(`${query.username} disconnected`)
        documentMap.delete(roomName)
    })
})

httpServer.listen(port, () => console.log(`collaboration-service listening on port ${port}`));

// Export our app for testing purposes
export default io;