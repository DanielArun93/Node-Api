const mongoose = require('mongoose');
// console.log('process.env.PORT',process.env.PORT);
// console.log('process.env.PORT',process.env.MONGODB_URI);
// console.log('process.env.PORT',process.env.JWT_SECRET);
mongoose.Promise = global.Promise;
mongoose.connect((process.env.MONGODB_URI ||'mongodb://localhost:27017/ToDoApp'), { useNewUrlParser: true }, (err, res) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("Mongodb Server Connect");
    }
});

module.exports ={
    mongoose
};