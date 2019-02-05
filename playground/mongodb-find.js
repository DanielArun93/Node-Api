const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://10.232.204.67:55555/ToDoApp', (err, db) => {
    if (err) {
        console.log("Unable to connect To Mongodb server");
    }
    else {
        console.log("Connected to MongoDb server");
    }

    // db.collection('todos').find({ _id:new ObjectID('5c49aaed5aa53277ac225809')}).toArray().then((docs) => {
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log(err);
    // })

     db.collection('users').find({email:"amkravi@gmail.com"}).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log(err);
    })

    db.close();

})