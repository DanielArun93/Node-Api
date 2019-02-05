const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://10.232.204.67:55555/ToDoApp', (err, db) => {
    if (err) {
        console.log("Unable to connect To Mongodb server");
    }
    else {
        console.log("Connected to MongoDb server");
    }

    //deleteone
    db.collection('users').deleteOne({ location: 'Philadelphia' }).then((res) => {
        console.log(res)
    })

    //findoneanddelete
    db.collection('users').deleteMany({ location: 'Philadelphia' }).then((res) => {
        console.log(res)
    })

    //deletemany
    db.collection('users').findOneAndDelete({ name: "Jane" }).then((res) => {
        console.log(res);
    });


    db.close();

})