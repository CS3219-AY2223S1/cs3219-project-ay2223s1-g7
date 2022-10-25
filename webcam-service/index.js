import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io'

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());
app.options('*', cors())

const httpServer = createServer(app)
const PORT = process.env.PORT || 8004

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
        console.log("DISCONNECT");

        socket.broadcast.emit("callended");
    });

    socket.on("calluser", ({userToCall, signalData, from, name}) => {
        io.to(userToCall).emit("calluser", {signal: signalData, from, name});
        console.log("CALLING");
    })

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
        console.log("ANSWERING");

    })
});
httpServer.listen(PORT, () => console.log("user-service listening on port " + PORT));