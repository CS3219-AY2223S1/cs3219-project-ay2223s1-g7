import { io } from "socket.io-client";
import { assert } from "chai";
import { v4 as uuidv4 } from 'uuid';
import app from '../index.js';

const SOCKET_URL = "http://localhost:8002"


describe("Collaboration service test", function () {
    let client, client2, client3, client4, client5, client6

    it('should connect user with username and roomId', function (done) {
        let roomId = uuidv4()
        client = io(SOCKET_URL, {
            query: {
                "username": "username",
                "roomName": roomId
            }
        });
        client.on('connectSuccess', function (data) {
            done();
        });
    });
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
    it('should get document', function (done) {
        let roomId = uuidv4()
        client4 = io(SOCKET_URL, {
            query: {
                "username": "username4",
                "roomName": roomId
            }
        });
        client4.emit('getDocument', (response) => {
            done()
        })
    });
    it('should be notified when peer disconnects', function (done) {
        let roomId = uuidv4()
        client5 = io(SOCKET_URL, {
            query: {
                "username": "username5",
                "roomName": roomId
            }
        });
        client6 = io(SOCKET_URL, {
            query: {
                "username": "username6",
                "roomName": roomId
            }
        });
        client6.on("collaborator_left", function () {
            done();
        })
        function disconnect() {
            client5.disconnect()
        }
        setTimeout(disconnect, 50)
    });
});

