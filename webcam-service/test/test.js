import { io } from "socket.io-client";
import { assert } from "chai";
import { v4 as uuidv4 } from 'uuid';
import app from '../index.js';

const SOCKET_URL = "http://localhost:8004"


describe("webcam service test", function () {
    let client1, client2

    it('should disconnect on sending empty username', function (done) {
        let roomName = 'room-' + uuidv4()
        client1 = io(SOCKET_URL, {
            path: "/api/webcam",
            query: {
                "username": "",
                "roomName": roomName
            }
        });
        client1.on('disconnect', function () {
            done()
        })
    });

    it('should disconnect on sending invalid roomname', function (done) {
        let roomName = 'room-invalid_roomname'
        client1 = io(SOCKET_URL, {
            path: "/api/webcam",
            query: {
                "username": "username2",
                "roomName": roomName
            }
        });
        client1.on('disconnect', function () {
            done()
        })
    });

    it('should join same room', function (done) {
        let roomName = 'room-' + uuidv4()
        client1 = io(SOCKET_URL, {
            path: "/api/webcam",
            query: {
                "username": "username2",
                "roomName": roomName
            }
        });
        client2 = io(SOCKET_URL, {
            path: "/api/webcam",
            query: {
                "username": "username3",
                "roomName": roomName
            }
        });
        client1.on('joinRoomSuccess', function (data) {
            assert.strictEqual(data.users.length, 2)
            done()
        });
    });

    it('should receive signal data', function (done) {
        client1.on('calluser', function (data) {
            assert.deepEqual(data, { signal: 'data' });
            done()
        });
        function call() {
            client2.emit("calluser", { signalData: 'data' })
        }
        setTimeout(call, 10)
    });

    it('should receive end call', function (done) {
        client1.on('callended', function () {
            done()
        });
        function call() {
            client2.emit("endCall")
        }
        setTimeout(call, 10)
    });

    it('should receive reject call', function (done) {
        client1.on('rejectCall', function () {
            done()
        });
        function call() {
            client2.emit("rejectCall")
        }
        setTimeout(call, 10)
    });

});

