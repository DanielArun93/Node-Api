var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var Userschema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a vaild email'
        }

    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})
//instance methods
Userschema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
}

Userschema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();

    user.tokens = user.tokens.concat([{ access, token }]);

    return user.save().then(() => {
        return token;
    })
}

Userschema.methods.removeToken = function (token) {
    var user = this;
    return user.update({
        $pull: {
            tokens: { token }
        }
    })
}

//model methods
Userschema.statics.findByToken = function (token) {
    users = this;
    var decode;
    try {
        decode = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }
    return users.findOne({
        '_id': decode._id,
        'tokens.access': 'auth',
        'tokens.token': token
    })
}

Userschema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                //console.log(hash);
                user.password = hash;
                next();
            })
        })
    } else {
        next()
    }
})

Userschema.statics.findByCredentials = function (email, password) {

    return users.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                }
                else {
                    reject(err);
                }

            })
        })
    })
}

//Model creation for Users
var users = mongoose.model('users', Userschema)

module.exports = {
    users
}