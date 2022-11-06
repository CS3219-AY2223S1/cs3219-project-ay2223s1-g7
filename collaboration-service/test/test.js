import { io } from "socket.io-client";
import { assert } from "chai";
import { v4 as uuidv4 } from 'uuid';
import app from '../index.js';
import { DocumentHistory } from '../document-history.js'

const SOCKET_URL = "http://localhost:8002"


describe("Collaboration service test", function () {
    let client, client2, client3, client4, client5, client6

    it('should connect user with username and roomId', function (done) {
        let roomId = 'room-' + uuidv4()
        client = io(SOCKET_URL, {
            path: "/api/collab",
            query: {
                "username": "username",
                "roomName": roomId
            }
        });
        client.on('connectSuccess', function () {
            done();
        });
    });

    it('should join same room', function (done) {
        let roomId = 'room-' + uuidv4()
        client2 = io(SOCKET_URL, {
            path: "/api/collab",
            query: {
                "username": "username2",
                "roomName": roomId
            }
        });
        client3 = io(SOCKET_URL, {
            path: "/api/collab",
            query: {
                "username": "username3",
                "roomName": roomId
            }
        });
        client2.on('joinRoomSuccess', function (data) {
            try {
                assert.deepEqual(data, { users: ['username2', 'username3'] })
            } catch (err) {
                assert.deepEqual(data, { users: ['username3', 'username2'] })
            }
            done()
        });
    });

    it('should get document', function (done) {
        let roomId = 'room-' + uuidv4()
        client4 = io(SOCKET_URL, {
            path: "/api/collab",
            query: {
                "username": "username4",
                "roomName": roomId
            }
        });
        client4.emit('getDocument', (response) => {
            assert.deepEqual(response, { version: 0, doc: '' })
            done()
        })
    });

    it('should be notified when peer disconnects', function (done) {
        let roomId = 'room-' + uuidv4()
        client5 = io(SOCKET_URL, {
            path: "/api/collab",
            query: {
                "username": "username5",
                "roomName": roomId
            }
        });
        client6 = io(SOCKET_URL, {
            path: "/api/collab",
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
        setTimeout(disconnect, 20)
    });
});


describe("DocumentHistory unit test", function () {
    it('should get the right document', function (done) {
        let roomName = "document1"
        let document = new DocumentHistory(roomName)
        let callback = (update) => {
            assert.deepEqual(update, { version: 0, doc: '' })
            done()
        }
        document.getDocument(callback)
    });

    it('should pull the right data', function (done) {
        let roomName = "document2"
        let document = new DocumentHistory(roomName)
        let count = 0

        let finish = () => {
            count += 1
            if (count === 2)
                done()
        }
        let callback = (update) => {
            assert.deepEqual(update, [{ clientID: 'client', changes: [[0, '1']] }])
            finish()
        }
        let callback2 = (resp) => {
            assert.deepEqual(resp, true)
            finish()
        }

        document.pullUpdates({ version: 0 }, callback)
        document.pushUpdates({ version: 0, updates: [{ clientID: 'client', changes: [[0, '1']] }] }, callback2)
    });

    it('should receive false when pushing wrong version', function (done) {
        let roomName = "document3"
        let document = new DocumentHistory(roomName)

        let callback = (resp) => {
            assert.strictEqual(resp, false)
            done()
        }

        document.pushUpdates({ version: 1, updates: [{ clientID: 'client', changes: [[0, '1']] }] }, callback)
    });
});
