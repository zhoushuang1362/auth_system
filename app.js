var createError = require('http-errors');
var express = require('express');
var morgan = require('morgan');
var FileStreamRotator = require('file-stream-rotator')
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var indexRouter = require('./routes/index');
var catalogRouter = require('./routes/catalog');
var bodyParser = require('body-parser');
var app = express();
// 设置 Mongoose 连接
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/shelter-managerdb?retryWrites=true';
mongoose.set('useFindAndModify', false);
mongoose.connect(mongoDB,
  {useUnifiedTopology: true,
    useNewUrlParser: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//解析请求体用的，比如req.body
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({extended: false}));

//log
//自定义token
morgan.token('time', function(req, res){
  return req._startTime; 
});
morgan.token('url',function(req,res){
  return req.url;
});
morgan.token('remote-user',function(req,res){
  if(req.session.user){
    return ' user_id>'+req.session.user._id+' role>'+req.session.user.role.role_name+' user_name>'+req.session.user.family_name+' '+req.session.user.given_name;
  }else{
    return ' -';
  }
});
// 自定义format，其中包含自定义的token
morgan.format('joke', 'date>:time remote-addr>:remote-addr status>:status method>:method :remote-user referrer>:referrer');
//跳过不需要记录的请求
function skip (req) {
  return (req.url).indexOf('stylesheets') != -1 || (req.url).indexOf('javascripts') != -1
}
//日志分割
var logDirectory = path.join(__dirname, 'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})

//var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(morgan('joke'));
app.use(morgan('joke', {skip:skip,stream: accessLogStream}));


//设置session用于保持登录状态
app.use(session({
	secret: 'keyboard cat',
	cookie: {maxAge: 24 * 60 * 60 * 1000},
	resave: true,
	saveUninitialized: true
}));
app.use(function(req, res, next){ 
  res.locals.session = req.session;
  next();
});


//登录拦截器
app.all('/*', function(req, res, next){
  if (req.session.user) {
    next();
  }else {
    var arr = req.url.split('/');// 解析用户请求的路径

    for (var i = 0, length = arr.length; i < length; i++) {// 去除 GET 请求路径上携带的参数
      arr[i] = arr[i].split('?')[0];
    }
    if (arr.length > 1 && arr[1] == '') {// 判断请求路径是否为根、登录、注册、登出，如果是不做拦截
      next();
    } else if (arr.length > 1 && (arr[1] == 'register' || arr[1] == 'login' || arr[1] == 'logout')) {
      next();
    } else {  // 登录拦截
      res.redirect('/login');  // 将用户重定向到登录页面
    }
  }
});


app.use('/', indexRouter);
app.use('/catalog',catalogRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
//
module.exports = app;