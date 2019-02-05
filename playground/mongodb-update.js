const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://10.232.204.67:55555/ToDoApp', (err, db) => {
    if (err) {
        console.log("Unable to connect To Mongodb server");
    }
    else {
        console.log("Connected to MongoDb server");
    }

    db.collection('users').findOneAndUpdate({
        _id: new ObjectID("5c4ad10723a9b767a8b2609f")
    },
        {
            $inc: {
                'age': 2
            },
            $rename: {
                'Remooo':"name"
            }
        },
        {
            returnOriginal: false
        },
        (err, res) => {
            
            if(err)
            console.log(err)
            else
            console.log(res);
        })

    db.close();

})