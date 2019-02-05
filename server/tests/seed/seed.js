const {ObjectID} = require('mongodb');
const {todo} = require('../../models/todos');
const {users} = require('../../models/users');
const jwt = require('jsonwebtoken');

var userOne = new ObjectID();
var userTwo = new ObjectID();


//for dummy user collections
const userList = [{
    "_id": userOne,
    "email": "arun@gmail.com",
    "password": "123@qwerty",
    "tokens": [{
        "access": 'auth',
        "token": jwt.sign({ _id: userOne.toHexString(), access: 'auth' }, 'abc123').toString()
    }]
},
{
    "_id": userTwo,
    "email": "amkravi@gmail.com",
    "password": "12345@qwerty",
    "tokens": [{
        "access": 'auth',
        "token": jwt.sign({ _id: userTwo.toHexString(), access: 'auth' }, 'abc123').toString()
    }]
}]


//for dummy todos to check getapi
const todos = [
    {
        "_id": new ObjectID(),
        "text": "This is one",
        "_creator":userOne
    },
    {
        "_id": new ObjectID(),
        "text": "This is two",
        "completed": true,
        "completedAt": 333,
        "_creator":userTwo
    }
]

const populateTodos = (done) => {
    todo.remove({}).then(() => {
        todo.insertMany(todos).then(() => {
            done();
        })
    })
}

const populateUsers = (done) => {
    users.remove({}).then(() => {
        var uone = new users(userList[0]).save();
        var utwo = new users(userList[1]).save();

        return Promise.all([uone,utwo])
        
    }).then(() => done());
}

module.exports = {
    todos,
    populateTodos,
    userList,
    populateUsers
}