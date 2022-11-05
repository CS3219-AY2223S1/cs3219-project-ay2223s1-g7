import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import mongoose from 'mongoose';

// Configure chai
chai.use(chaiHttp);
chai.should();

console.log(`DB connection state: ${mongoose.connection.readyState}`);

describe("User service test", () => {
    var cookie = "", cookie2 = "", cookie3 = ""

    it("should create a user", (done) => {
        chai.request(app)
            .post('/api/user')
            .send({ username: 'tomtest', password: 'jerry' })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                done();
            });
    });

    it("should not create a user with duplicate name", (done) => {
        chai.request(app)
            .post('/api/user')
            .send({ username: 'tomtest', password: 'duplicate name' })
            .end((err, res) => {
                res.should.have.status(409);
                res.body.should.be.a('object');
                done();
            });
    });

    it("should log in", (done) => {
        chai.request(app)
            .post('/api/user/login')
            .send({ username: 'tomtest', password: 'jerry' })
            .end((err, res) => {
                res.should.have.cookie("token")
                cookie = res.header["set-cookie"][0]
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it("should authenticate", (done) => {
        chai.request(app)
            .post('/api/user/authenticate')
            .set('Cookie', cookie)
            .send({})
            .end((err, res) => {
                res.should.not.have.cookie("token");
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it("should log out", (done) => {
        chai.request(app)
            .post('/api/user/logout')
            .set('Cookie', cookie)
            .send({})
            .end((err, res) => {
                res.should.not.have.cookie("token");
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it("should change password", (done) => {
        setTimeout(() => {
            chai.request(app)
                .post('/api/user/login')
                .send({ username: 'tomtest', password: 'jerry' })
                .end((err, res) => {
                    res.should.have.cookie("token")
                    cookie2 = res.header["set-cookie"][0]
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                });
        }, 1000);

        setTimeout(() => {
            chai.request(app)
                .post('/api/user/changepw')
                .set('Cookie', cookie2)
                .send({ oldPassword: 'jerry', newPassword: 'jerry2' })
                .end((err, res) => {
                    res.should.not.have.cookie("token");
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                });

        }, 1200);

        setTimeout(() => {
            chai.request(app)
                .post('/api/user/login')
                .send({ username: 'tomtest', password: 'jerry2' })
                .end((err, res) => {
                    res.should.have.cookie("token")
                    cookie3 = res.header["set-cookie"][0]
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done()
                });
        }, 2200);
    }).timeout(2400);


    it("should delete a user", (done) => {
        chai.request(app)
            .post('/api/user/delete')
            .set('Cookie', cookie3)
            .send({})
            .end((err, res) => {
                res.should.not.have.cookie("token");
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});