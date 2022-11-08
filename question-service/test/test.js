import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import mongoose from 'mongoose';

// Configure chai
chai.use(chaiHttp);
chai.should();

console.log(`DB connection state: ${mongoose.connection.readyState}`);

describe("App", () => {
    describe("GET /", () => {
        it("should create a question", (done) => {
            chai.request(app)
                .post('/api/question')
                .send({ title: 'qn test', question: 'what is 1 + 1?', difficulty: 'TEST' })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    done();
                });
        });

        it("should not create a question with duplicate title", (done) => {
            chai.request(app)
                .post('/api/question')
                .send({ title: 'qn test', question: 'is this a duplicate question?', difficulty: 'TEST' })
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    done();
                });
        });

        it("should get a question", (done) => {
            chai.request(app)
                .post('/api/question/get')
                .send({ difficulty: 'TEST', userOne: 'testOne', userTwo: 'testTwo' })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    done();
                });
        });

        it("should attempt a question", (done) => {
            chai.request(app)
                .post('/api/question/attemptQuestion')
                .send({ title: 'qn test', user: 'testOne' })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    done();
                });
        });

        it("should attempt a question", (done) => {
            chai.request(app)
                .post('/api/question/attempts')
                .send({ user: 'testOne' })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    assert.equal(res.body.question[0].title, 'qn test')
                    done();
                });
        });
         
        it("should delete a question", (done) => {
            chai.request(app)
                .post('/api/question/delete')
                .send({ title: 'qn test' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

    });
});