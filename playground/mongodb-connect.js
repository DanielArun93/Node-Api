//const MongoClient = require('mongodb').MongoClient;

//After destructuring of mongodb object
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://10.232.204.67:55555/ToDoApp', (err, db) => {
    if (err) {
        console.log("Unable to connect To Mongodb server");
    }
    else {
        console.log("Connected to MongoDb server");
    }

    db.collection('users').insertOne({
        'name':'Jane',
        'location':'NewJersey',
        'age':25
    }, (err, res) => {
        if (err) {
            console.log("Unable to insert", err)
        }
        console.log(JSON.stringify(res.ops, undefined, 2));
    })
    
    db.close();

})