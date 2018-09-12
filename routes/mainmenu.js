var express = require('express');
var mainMenu = express.Router();


mainMenu.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Home',
        tips: '这是主页'
    });
});

mainMenu.get('/home', function (req, res, next) {
    res.render('index', {
        title: 'Home',
        tips: '这是主页'
    }); //网页主页模版
});

module.exports = mainMenu;