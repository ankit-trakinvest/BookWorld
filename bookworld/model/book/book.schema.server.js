var mongoose = require("mongoose");

var bookSchema = mongoose.Schema({
    name: String,
    description: String,
    authors: String,
    cover: String,
    externalId: {type: String, unique: true},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "UserModel"}],
    dateCreated: {type: Date, default: Date.now}
}, {collection: "book"});

module.exports = bookSchema;

