import { io } from "socket.io-client";
import { assert } from "chai";
import app from '../index.js';


const SOCKET_URL = "http://localhost:8001"


describe("Matching service test", function () {
    let client, client2, client3, client4, client5

    it('should connect user with username and difficulty', function (done) {
        client = io(SOCKET_URL, {
            path: "/api/match",
            query: {
                "username": "username",
                "difficulty": "EASY"
            }
        });
        client.on('connect', function () {
            done();
        });
    });
    it('should match user', function (done) {
        client2 = io(SOCKET_URL, {
            path: "/api/match",
            query: {
                "username": "username2",
                "difficulty": "HARD"
            }
        });
        setTimeout(
            () => {
                client3 = io(SOCKET_URL, {
                    path: "/api/match",
                    query: {
                        "username": "username3",
                        "difficulty": "HARD"
                    }
                })
            }, 40
        )
        client2.on('matchSuccess', function (data) {
            console.log(data)
            assert.isString(data)
            done();
        });
    });
    it('should fail match in 30s', function (done) {
        client4 = io(SOCKET_URL, {
            path: "/api/match",
            query: {
                "username": "username4",
                "difficulty": "MEDIUM"
            }
        });
        client4.on('matchFail', function () {
            done();
        });
    }).timeout(31000);
    it('should disconnect', function (done) {
        client5 = io(SOCKET_URL, {
            path: "/api/match",
            query: {
                "username": "username5",
            }
        });
        client5.on('disconnect', function () {
            done();
        });
    });
});

