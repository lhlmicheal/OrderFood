var mongodb = require('mongodb');
var settings = require('./setting');

var server = new mongodb.Server(settings.host, settings.port, { auto_reconnect: true });
var db = new mongodb.Db(settings.dbName, server, { safe: true });

db.open(function (err, db) {
    if (err) {
        throw err;
    }
    console.log('connnect db');
});

module.exports = db;