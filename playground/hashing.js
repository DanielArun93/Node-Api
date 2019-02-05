const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10,(err,salt) => {
    bcrypt.hash(password,salt,(err,hash) => {
        console.log(hash);
       
    })
})
var hashedPwd = '$2a$10$w/WIEkPZU15a9t1W90eh6eLQqKMPhajmG69pEH8.h2czhtfQnxbkq'
bcrypt.compare(password,hashedPwd,(err,res) => {
    console.log(res);
})

// var data = {
//     id:4
// }

// var token = {
//     data,
//     hash:SHA256(JSON.stringify(data) + 'Iam unknown').toString()
// }

 //token.data.id = 5;
 //token.data.hash = SHA256(JSON.stringify(data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'Iam unknown').toString()
// if(token.hash == resultHash){
//     console.log("Auth success");
// }
// else{
//     console.log("Auth fail");
// }

//jwt token validation
// var string = "secrete";

// var token = jwt.sign(string,'yoyo');
// console.log(token);

// var decode = jwt.verify(token,'yoyo');
// console.log(decode);
