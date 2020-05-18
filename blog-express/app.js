var createError = require('http-errors'); //如果404错误页的处理
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); 
var logger = require('morgan'); 
const session = require('express-session');
const RedisStore = require('connect-redis')(session)

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev')); //写日志
app.use(express.json());//处理post请求中的json数据
app.use(express.urlencoded({ extended: false }));//处理post请求中其他格式 例如x-www.form-urlencoded
app.use(cookieParser());//解析cookie
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  'secret':'lvxin',
  cookie:{
    path:'/', //默认配置
    httpOnly:true, //默认配置
    maxAge : 24*60*60*1000, //一天
  },
  store: sessionStore
}))

app.use('/api/user' , userRouter);//注册用户路由 跟路由/api/user
app.use('/api/blog' , blogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
