var express = require('express');

//引用数据库服务
var DB = require('../database/db');
var user = express.Router();

//用户注册业务
user.get('/register', function (req, res, next) {
    res.render('register', { title: 'Registration' });
});
user.post('/register', function (req, res, next) {
    //解析请求对象字段，获取用户名，密码，邮箱等信息
    var name = req.body.name;
    var passward = req.body.passward;
    var re_passward = req.body.re_passward;
    if (passward != re_passward)
        console.log('user:post:register:');
    //是否已经有这个用户，如果该用户存在，直接返回提示
    //用户不存在就保存用户。
});

user.get('/login', function (req, res, next) {
    res.render('login', { title: 'Login' });
});
user.post('/login', function (req, res, next) {
    // res.render('login', { title: 'Login' });
    //校验用户名，密码，邮箱
    //用户不存在就返回提示
    //用户存在返回登录成功
});

module.exports = user;