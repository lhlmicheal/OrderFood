//使用express框架
//express是一个封装的路由，即由url以及对应的处理函数组成的请求处理逻辑。
//express必须给一个默认处理错误的中间件(函数)

//system module
var express = require('express');
var session = require('express-session');
var path = require('path');

//business module
var mainMenu = require('./routes/mainmenu');
var user = require('./routes/user');

//third module
var flash = require('connect-flash');

var app = express();

//设置模版引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var server = app.listen(3000, 'localhost', function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listen at http://%s,%s', host, port);
});

//将主菜单业务处理的路由单独写在一个文件(模块中)，通过app.use引用。
app.use(flash);
app.use(mainMenu);
app.use(user);

app.use(specialCodeHandle);
app.use(errorHandle);

//404并不属于一个错误，只是表示某些功能为完成。因此还需要为这种类型添加中间件.
//只是当接收到类似的错误时，我们把这种错误统一交由错误处理中间件函数处理。
function specialCodeHandle(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

//下面的错误处理函数，是统一的错误处理中间件。
function errorHandle(err, req, res, next) {
    if (res.headersSent) {
        return next(err); //自定义的错误处理句柄，并没有处理这个error，express内置的缺省错误处理句柄在最后兜底.
    }
    res.status(err.status || 500);
    res.render('error', { error: err });
}

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
module.exports = app;