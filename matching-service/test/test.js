import { io } from "socket.io-client";
import { assert } from "chai";
import app from '../index.js';


const SOCKET_URL = "http://localhost:8001"


describe("Matching service test", function () {
    let client, client2, client3, client4, client5

    it('should connect user with username and difficulty', function (done) {
        client = io(SOCKET_URL, {
            query: {
                "username": "username",
                "difficulty": "EASY"
            }
        });
        client.on('connect', function (data) {
            done();
        });
    });
    it('should match user', function (done) {
        client2 = io(SOCKET_URL, {
            query: {
                "username": "username2",
                "difficulty": "HARD"
            }
        });
        client3 = io(SOCKET_URL, {
            query: {
                "username": "username3",
                "difficulty": "HARD"
            }
        });
        client2.on('matchSuccess', function (data) {
            done();
        });
    }).timeout(5000);
    it('should fail match in 30s', function (done) {
        client4 = io(SOCKET_URL, {
            query: {
                "username": "username4",
                "difficulty": "MEDIUM"
            }
        });
        client4.on('matchFail', function (data) {
            done();
        });
    }).timeout(31000);
    it('should disconnect', function (done) {
        client5 = io(SOCKET_URL, {
            query: {
                "username": "username5",
            }
        });
        client5.on('disconnect', function (data) {
            done();
        });
    });
});

