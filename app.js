require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit')
const session = require('express-session')
const hbs = require('hbs')
const csrf = require('lusca').csrf
const { v4:uuidv4 } = require('uuid');
const logger = require('morgan');

const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const db = require('./config/connection');
const fileUpload = require('express-fileupload');

const app = express();

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
const oneDay = 1000 * 60 * 60;
app.use(session({secret:uuidv4(),resave:true,saveUninitialized:true,cookie:{maxAge:oneDay}}))
app.use(csrf())

var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 15
});
app.use(limiter)

// database connection
db.connect();

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
