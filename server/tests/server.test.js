const expect = require('expect');
const request = require('supertest');

const { ObjectID } = require('mongodb');
const { app } = require('./../server');

const { todo } = require('./../models/todos');
const { users } = require('./../models/users');
const { todos, populateTodos, userList, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);
console.log('test',userList[1].tokens[0].token);
describe('POST /todos', () => {

    it('Should pass todo string', (done) => {
        var text = "This is fom Postman";
        request(app)
            .post('/todos')
            .set('x-auth',userList[1].tokens[0].token)
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                todo.find({ text }).then((response) => {
                    expect(response.length).toEqual(1);
                    expect(response[0].text).toBe(text);
                    done();
                }, (e) => {
                    done(e);
                })
            })
    })

    it('Should  not pass with invalid data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth',userList[1].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                todo.find().then((res) => {
                    expect(res.length).toEqual(2);
                    done();
                })
                    .catch((e) => done(e))
            })
    })

})

describe('GET /todos', () => {
    it('Should get todos collections', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth',userList[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toEqual(1);
            })
            .end(done);
    })
})

describe('GET /todos/:id', () => {
    it('Should get particular ids doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth',userList[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.doc.text).toEqual(todos[0].text);
            })
            .end(done)
    })

    it('Should not send particular doc if it is not authenticated', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth',userList[0].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('Should send 404 if doc is invalid', (done) => {
        request(app)
            .get('/todos/123')
            .set('x-auth',userList[1].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done)
    })

    it('Should send 404 if doc is not available', (done) => {
        var dummyurl = new ObjectID().toHexString;
        request(app)
            .get(`/todos/dummyurl`)
            .set('x-auth',userList[1].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done)
    })
})

describe('DELETE /todos', () => {
    it('Should delete the doc given', (done) => {
        request(app)
            .delete(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth',userList[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.doc._id).toEqual(todos[1]._id)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                todo.findById(todos[1]._id).then((doc) => {
                    expect(doc).toNotExist();
                    done();
                }, (e) => {
                    return done(e);
                })
            })
    })

    it('Should send 404 if delete id is invalid', (done) => {
        request(app)
            .delete('/todos/123')
            .set('x-auth',userList[1].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('Should send 404 if deleted id is not available', (done) => {
        var dummyurl = new ObjectID().toHexString;
        request(app)
            .get(`/todos/dummyurl`)
            .set('x-auth',userList[1].tokens[0].token)
            .expect(404)
            .end(done)
    })
})

describe('PATCH /todos', () => {
    it('Should update the todos', (done) => {
        var text = "This is from test file1";
        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth',userList[0].tokens[0].token)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.doc.completed).toEqual(true)
                expect(res.body.doc.text).toEqual(text)
            })
            .end(done)
    })

     it('Should not update if it not auth', (done) => {
        var text = "This is from test file1";
        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth',userList[1].tokens[0].token)
            .send({
                completed: true,
                text
            })
            .expect(404)
            .end(done)
    })
    //use either one above or below for testing
    // it('Should not update when completed is false',(done) => {
    //     var text = "This is from test file2";       
    //     request(app)
    //         .patch(`/todos/${todos[1]._id.toHexString()}`)
    //         .send({
    //             completed:false,
    //             text
    //         })
    //         .expect(200)
    //         .expect((res) => {
    //             expect(res.body.doc.completed).toEqual(false)
    //             expect(res.body.doc.completedAt).toEqual(null)
    //             expect(res.body.doc.text).toEqual("This is from test file2")
    //         })
    //         .end(done)
    // })
})

//Test cases for User Api

describe('GET /users/me', () => {
    it('Should send user if it is authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', userList[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(userList[1]._id.toHexString());
                expect(res.body.email).toBe(userList[1].email)
            })
            .end(done)
    })

    it('Should send 401 if it is not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done)
    })
})

describe('POST /users', () => {

    it('Should send the user obj', (done) => {
        var email = "example@example.com";
        var password = "123abc";
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                users.findOne({ email }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e))
            })
    })

    it('Should send the validation error', (done) => {
        var email = "example@examplecom";
        var password = "123abc";
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                expect(res.body._message).toBe("users validation failed");
            })
            .end(done)
    })

    it('Should not create user obj if email is duplicate', (done) => {
        var email = "amkravi@gmail.com";
        var password = "123abc";
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                expect(res.body.errmsg).toBe("E11000 duplicate key error collection: ToDoAppTest.users index: email_1 dup key: { : \"amkravi@gmail.com\" }");
            })
            .end(done)
    })
})

describe('POST /users/login', () => {
    it('Should login users if pwd is valid', (done) => {

        request(app)
            .post('/users/login')
            .send({
                email: userList[0].email,
                password: userList[0].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toEqual(userList[0].email);
                expect(res.body._id).toExist();
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                users.findOne({ email: userList[0].email }).then((user) => {
                    if (!user) {
                        return done(err);
                    }
                    expect(user.tokens[0].token).toExist();
                    done();
                }, (e) => {
                    return done(err);
                })
            })
    })

    it('Should reject invalid login', (done) => {
        var email = "ad@gmail.com";
        request(app)
            .post('/users/login')
            .send({
                email: email,
                password: userList[1].password
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end(done);
    })
})

describe('DELETE /users/me/token', () => {
    it('Should delete the Token If it is valid', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', userList[1].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                users.findOne({ _id: userList[1]._id }).then((user) => {
                    if (!user) {
                        return done(err);
                    }
                    expect(user.tokens.length).toEqual(0);
                    done();
                }).catch((e)=>done(e));
            })
    })

})
