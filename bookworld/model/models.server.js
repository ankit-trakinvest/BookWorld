var mongoose = require("mongoose");
mongoose.Promise = require("q").Promise;

//var connectionString = "mongodb://127.0.0.1:27017/bookworld";
var connectionString = "mongodb://admin:zxcvwt80@ds161860.mlab.com:61860/heroku_092hshmc";

if (process.env.MLAB_USERNAME_WEBDEV) { // check if running remotely
    var username = process.env.MLAB_USERNAME_WEBDEV; // get from environment
    var password = process.env.MLAB_PASSWORD_WEBDEV;
    var connectionUrl = process.env.MLAB_CONNECTION_URL;
    connectionString = 'mongodb://' + username + ':' + password + connectionUrl;
}
var dbConnection = mongoose.connect(connectionString, {useMongoClient: true});
module.exports = dbConnection;

mongoose.connection.on('connected', function () {
    console.log("Connected to MongoDB");
});

mongoose.connection.on('error', function (err) {
    console.log("Error : couldn't connect to MongoDB " + err);
});

mongoose.connection.on('disconnected', function () {
    console.log("Disconnected from MongoDB");
});