const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";

var db; 

module.exports = {
    
    createConnection: function (callback) {
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
            db = client.db('raspiproject');
            return callback(err);
        });
    },

    getDb: function () {
        return db;
    }
};