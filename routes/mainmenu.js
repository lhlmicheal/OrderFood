var express = require('express');
var mainMenu = express.Router();


mainMenu.get('/', function (req, res, next) {
    res.render('index', { title: 'Home' });
});

mainMenu.get('/home', function (req, res, next) {
    res.render('index', { title: 'Home' }); //网页主页模版
});

module.exports = mainMenu;