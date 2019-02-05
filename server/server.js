var config = require('./config/config');


var express = require('express');
var bodyparser = require('body-parser');
var _ = require('lodash');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { todo } = require('./models/todos');
var { users } = require('./models/users');
var { authenticate } = require('./middleware/authenticate');
const bcrypt = require('bcryptjs');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyparser.json());

app.post('/todos',authenticate, (req, res) => {
    console.log(req.body);
    var task = new todo({
        text: req.body.text,
        completed: req.body.completed,
        _creator:req.user._id
    })

    task.save().then((docs) => {
        res.send(docs);
    }, (err) => {
        res.status(400).send(err);
    })
})

app.get('/todos',authenticate, (req, res) => {
    todo.find({_creator:req.user._id}).then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    })
})

//to get particular todo
app.get('/todos/:id',authenticate, (req, res) => {
    //console.log(req.params.id);
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    todo.findOne({_id:id,_creator:req.user._id}).then((doc) => {
        if (!doc) {
            return res.status(404).send();
        }
        res.send({ doc })

    }, (e) => {
        res.status(400).send(e);
    })
})

//for deletion of docs
app.delete('/todos/:id',authenticate, (req, res) => {
    //console.log(req.params.id)
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    todo.findOneAndRemove({_id:id,_creator:req.user._id}).then((doc) => {
        if (!doc) {
            return res.status(404).send();
        }
        res.send({ doc });
    }, (e) => {
        res.status(400).send(e);
    })
})

//to update
app.patch('/todos/:id', authenticate,(req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    var body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    todo.findOneAndUpdate({_id:id,_creator:req.user._id}, {
        $set: body
    }, {
            new: true
        }).then((doc) => {
            if (!doc) {
                return res.status(404).send();
            }
            res.send({ doc })
        }, (e) => {
            res.status(400).send();
        })
})

//for user model api calls started 

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new users(body);

    user.save().then((doc) => {
        //console.log(doc);
        return user.generateAuthToken();
    }).then((token) => {
        //below iam passing the instance user object
        res.header('x-auth', token).send(user);
    })
        .catch((e) => {
            res.status(400).send(e);
        })
})



//private route and auth middleware

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})

//for login
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    users.findByCredentials(body.email,body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
           res.header('x-auth', token).send(user);
        });

    }).catch((e) => {
        res.status(400).send(e)
    })
})

//for logout
app.delete('/users/me/token',authenticate,(req,res) => {
    req.user.removeToken(req.token).then((token) => {
        res.send();
    })
    .catch((e) => {
        res.status(404).send(e);
    })
})



app.listen(port, (err) => {
    if (err) {
        console.log("Unable to connect to Server");
    }
    else {
        console.log(`Server Connected to the port ${port}`);
    }
})


module.exports = {
    app
}
























































































// var saveObj = new todo({
//     text:'Drink 2 lit Water'
// })

// var saveUser = new users({
//     email:'amkravi@gmail.com'
// })

// saveObj.save().then((docs) => {
// console.log('Data added Successfully',docs);
// },(err) => {
// console.log(err,'Unable to add DAATA');
// })

// saveUser.save().then((docs) => {
// console.log('Data added Successfully',docs);
// },(err)=>{
// console.log(err,'Unable to add DAATA');
// })