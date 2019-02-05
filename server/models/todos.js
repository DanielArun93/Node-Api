var mongoose = require('mongoose');

//Model creation for todos
var todo = mongoose.model('todos', {
    text: {
        type: String,
        required:true,
        trim:true,
        minlength:1
    },
    completed: {
        type: Boolean,
        default:false
    },
    completedAt: {
        type: Date,
        default:null
    },
    _creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
})

module.exports = {
    todo
}

