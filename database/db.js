var mongodb = require('mongodb');
var settings = require('../setting');

var server = new mongodb.Server(settings.db.host, settings.db.port, { auto_reconnect: true });
var db = new mongodb.Db(settings.db.dbName, server, { safe: true });

db.open(function (err, db) {
    if (err) {
        throw err;
    }
    console.log('connnect db');
    db.close();
    console.log('close db');
});

module.exports = db;