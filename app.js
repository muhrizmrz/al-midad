require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var hbs = require('hbs')
var { v4:uuidv4 } = require('uuid');
var logger = require('morgan');

var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
const db = require('./confiq/connection');
const fileUpload = require('express-fileupload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
const partialFolder = path.join(__dirname,'views/partials')
hbs.registerPartials(partialFolder)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static',express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
const oneDay = 1000 * 60;
app.use(session({secret:uuidv4(),resave:true,saveUninitialized:true,cookie:{maxAge:oneDay}}))

// database connection
db.connect((err)=>{
  if(err) console.log(err)
  else console.log("Database connected")
})

app.use('/admin', adminRouter);
app.use('/', usersRouter);

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

//localhost


module.exports = app;
