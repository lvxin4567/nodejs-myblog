var createError = require('http-errors'); //如果404错误页的处理
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session)

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');

//使用express的总结
//1.写法上的改变  许多杂碎的东西不用操心 例如res.json req.query不用自己获取
//2.使用express-session connect-redis 还有登陆中间件
//3.使用morgan管理日志


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
const env = process.env.NODE_ENV // 环境参数
if (env !== 'production') {
  //开发  or  测试
  app.use(logger('dev')); //写日志
} else {
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })

  app.use(logger('combined', {
    stream: writeStream
  }));
}

app.use(express.json()); //处理post请求中的json数据
app.use(express.urlencoded({
  extended: false
})); //处理post请求中其他格式 例如x-www.form-urlencoded
app.use(cookieParser()); //解析cookie
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  resave: true, //重新保存：强制会话保存即使是未修改的。(默认值ture)
  saveUninitialized: true, //强制保存未初始化的会话到存储器
  'secret': 'lvxin',
  cookie: {
    path: '/', //默认配置
    httpOnly: true, //默认配置
    maxAge: 24 * 60 * 60 * 1000, //一天
  },
  store: sessionStore
}))

app.use('/api/user', userRouter); //注册用户路由 跟路由/api/user
app.use('/api/blog', blogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;