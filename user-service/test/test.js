import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import mongoose from 'mongoose';

// Configure chai
chai.use(chaiHttp);
chai.should();

console.log(`DB connection state: ${mongoose.connection.readyState}`);

describe("App", () => {
    describe("GET /", () => {
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

         
        // Test to delete a user
        it("should delete a user", (done) => {
            chai.request(app)
                .post('/api/user/delete')
                .send({ username: 'tomtest' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

    });
});