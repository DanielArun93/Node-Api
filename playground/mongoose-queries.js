const {ObjectID} = require('mongodb');

const mongoose = require('../server/db/mongoose');
const { todo } = require('../server/models/todos');

var id = '7c4d623fa1880e12a013a8bc';

//id validation methods
if(!ObjectID.isValid(id)){
    return console.log("Invalid ID");
}

todo.find({
    completed:false
}).then((res) => {
    console.log(`TODO-Find ${res}`);
})

todo.findOne({
    completed:false
}).then((res) => {
    console.log(`TODO-FindOne ${res}`);
})

todo.findById(id).then((res) => {
    console.log(`TODO-FindOne ${res}`);
},(err) => {
    console.log(err);
})