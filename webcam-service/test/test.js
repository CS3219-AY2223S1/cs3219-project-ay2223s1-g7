import { io } from "socket.io-client";
import { assert } from "chai";
import { v4 as uuidv4 } from 'uuid';
import app from '../index.js';

const SOCKET_URL = "http://localhost:8004"


describe("webcam service test", function () {
    let client2, client3, client4, client5, client6

    it('should join same room', function (done) {
        let roomId = uuidv4()
        client2 = io(SOCKET_URL, {
            query: {
                "username": "username2",
                "roomName": roomId
            }
        });
        client3 = io(SOCKET_URL, {
            query: {
                "username": "username3",
                "roomName": roomId
            }
        });
        client2.on('joinRoomSuccess', function (data) {
            if (data.users.length === 2) {
                done()
            }
        });
    });

    it('should receive signal data', function (done) {
        client2.on('calluser', function (data) {
            assert.deepEqual(data, { signal: 'data' });
            done()
        });
        function call() {
            client3.emit("calluser", { signalData: 'data' })
        }
        setTimeout(call, 30)
    });

    // add more tests
});

