var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String},
    firstName: String,
    lastName: String,
    email: String,
    cover: String,
    userType: {type: String, enum: ['PLAYER', 'SELLER', 'ADMIN'], default: "PLAYER"},
    books: [{type: mongoose.Schema.Types.ObjectId, ref: "BookModel"}],
    inventory: [{
        _book: {type: mongoose.Schema.Types.ObjectId, ref: "BookModel"},
        quantity: String,
        price: String
    }],
    liked: [{type: mongoose.Schema.Types.ObjectId, ref: "BookModel"}],
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: "UserModel"}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: "UserModel"}],
    google: {
        id: String,
        token: String
    },
    facebook: {
        id: String,
        token: String
    },
    dateCreated: {type: Date, default: Date.now}
}, {collection: "user"});

module.exports = userSchema;
