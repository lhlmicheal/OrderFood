var express = require('express');
var crypto = require('crypto');
// var session = require('express-session');
//引用数据库服务
var DB = require('../database/db');

var user = express.Router();

function User(user) {
    this.name = user.name;
    this.passward = user.passward;
    this.email = user.email;
}
User.prototype.save = function (callBack) {
    //待处理的数据
    var userData = {
        name: this.name,
        passward: this.passward,
        email: this.email
    };

    //打开数据库,
    //MongoDb API http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#insertOne
    DB.open(function (err, db) {
        console.log('mongo operation...save...open');
        if (err) return callBack(err);
        db.collection('users', function (err, collection) {
            console.log('mongo operation...collection...user');
            if (err) {
                DB.close();
                return callBack(err);
            }
            collection.insertOne(userData, { safe: true }, function (err, doc) {
                console.log('mongo operation...insert...user');
                DB.close();
                if (err) {
                    return callBack(err);
                }
                console.log('mongo operation...insert...ok');
                callBack(null, doc);
                console.log('mongo operation...insert...doc = ' + JSON.stringify(doc));
            });
        });
    });
};

User.prototype.get = function (userName, callBack) {
    DB.open(function (err, db) {
        //open函数打开成功后，自动执行该函数.db为当前打开的数据库实例对象
        console.log('mongo operation....open');
        if (err) return callBack(err);
        db.collection('users', function (err, collection) {
            //collection()数据库合集函数，数据库打开指定名字(users)合集后，自动执行该函数，collection为当前数据库合集名为(users)、
            //的实例对象
            console.log('mongo operation....collection open');
            if (err) {
                DB.close();
                return callBack(err);
            }
            var docData = collection.findOne({ name: userName }, { 'name': 1, 'passward': 1 }, function (err, doc) {
                //collection.findOne查找一条name==userName的文档数据.
                console.log('mongo operation....find open name=' + userName);
                DB.close();
                if (err) return callBack(err);
                console.log('mongo operation....find ok');
                callBack(null, doc);
                console.log('mongo operation....find doc = ' + JSON.stringify(doc));
            });
            if (docData) {
                console.log('mongo operation....find docData = ' + JSON.stringify(docData));
            }
        });
    });
};

//用户注册业务
user.get('/register', function (req, res, next) {
    res.render('register', {
        title: 'Registration',
        tips: req.flash('tips').toString(),
        error: req.flash('error').toString()
    });
});
user.post('/register', function (req, res, next) {
    //解析请求对象字段，获取用户名，密码，邮箱等信息
    console.log('user:post:register: ' + JSON.stringify(req.route) + ' end');
    console.log('user:post:body: ' + JSON.stringify(req.body) + ' end');
    var name = req.body.name;
    var passward = req.body.fir_password;
    var email = req.body.email;
    var re_passward = req.body.re_passward;
    if (passward != re_passward) {
        req.flash('tips', '两次输入密码不一致');
        return res.redirect('/register');//返回注册页
    }
    //生成密码的md5值
    var md5 = crypto.createHash('md5');
    var passwardMd5 = md5.update(passward).digest('hex');

    var tempUser = new User({
        name: name,
        passward: passward,
        email: email
    });
    //是否已经有这个用户，如果该用户存在，直接返回提示
    tempUser.get(tempUser.name, function (err, user) {
        //该函数是在数据库查询结果后，执行的业务逻辑函数
        if (err) {
            // req.flash('error', 'err');
            req.flash('error', '数据库查询错误');
            return res.redirect('/'); //返回主页
        }
        if (!Object.is(user, null)) {
            console.log('register: user: exist');
            req.flash('tips', '用户已存在');
            return res.redirect('/register');//返回注册页
        }
        //用户不存在，注册成功。写入到数据库。
        tempUser.save(function (err, user) {
            if (err) {
                // req.flash('error', err);
                console.log('register save: user: error');
                req.flash('error', '数据库写入错误');
                return res.redirect('/register'); //注册失败，返回主页
            }
            if (user) {
                console.log('register save: user: success');
                req.session.user = tempUser; //用户信息存入注册页
                req.flash('tips', '注册成功');
                return res.redirect('/');//返回主页
            }
        });
    });
});

user.get('/login', function (req, res, next) {
    res.render('login', {
        title: 'Login',
        tips: req.flash('tips').toString(),
        error: req.flash('error').toString()
    });
});
user.post('/login', function (req, res, next) {
    // res.render('login', { title: 'Login' });
    console.log('user:post:login:' + JSON.stringify(req.body) + ' end');
    // 是不是已经登录了
    var name = req.body.name;
    var passward = req.body.passward;
    var tempUser = new User({
        name: name,
        passward: passward
    });
    tempUser.get(tempUser.name, function (err, user) {
        console.log('dbCallback:login:user=' + JSON.stringify(user) + ' end');
        if (err) {
            req.flash('error', '服务器查询错误');
            return res.redirect('/login');
        }
        if (Object.is(user, null)) {
            req.flash('tips', '用户不存在');
            return res.redirect('/login');
        }
        if (user.passward != tempUser.passward) {
            req.flash('tips', '用户名与密码不符');
            return res.redirect('/login');
        }
        req.flash('tips', '登录成功!');
        return res.redirect('/login');
    });
});

module.exports = user;