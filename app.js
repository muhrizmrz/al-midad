require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')
const session = require('express-session')
const hbs = require('hbs')
const handlebarsHelpers = require('handlebars-helpers')();
const csrf = require('lusca').csrf
const { v4: uuidv4 } = require('uuid');
const logger = require('morgan');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');
const usersRouter = require('./routes/users');
const db = require('./config/connection');
const fileUpload = require('express-fileupload');



const app = express();

//// FOR DEVELOPMENT ////
let mode = "development"
if (mode == "development") {
  const liveReloadServer = livereload.createServer();
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  app.use(connectLiveReload());
}




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
const partialFolder = path.join(__dirname, 'views/partials')
hbs.registerPartials(partialFolder)

// Register handlebars-helpers
Object.keys(handlebarsHelpers).forEach(helperName => {
  hbs.registerHelper(helperName, handlebarsHelpers[helperName]);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
const oneDay = 1000 * 60 * 60;
app.use(session({ secret: uuidv4(), resave: true, saveUninitialized: true, cookie: { maxAge: oneDay } }))
app.use(csrf({ cookie: true }))

// Error 500 Handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error',{url:req.url || '/'})
});



var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15
});
app.use(limiter)

// database connection
db.connect(); 

app.use('/admin', adminRouter);
app.use('/api',apiRouter)
app.use('/', usersRouter);
app.use((req, res, next) => {
  res.redirect('/');
});

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

//localhost


module.exports = app;
