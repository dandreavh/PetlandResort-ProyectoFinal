/**@dandreavh */
// Import environment variables
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const validator = require('express-validator');

// ODM configuration - database
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_URI,)
  .then(() => console.log('DB connection successful'))
  .catch((err) => console.error('DB error connection: ' + err));

// Import routing
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const reservationsRouter = require('./routes/reservations');
const petsRouter = require('./routes/pets');
const datasRouter = require('./routes/datas');

// Initializations
const app = express();
require('./controller/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// static files placement
app.use(express.static(path.join(__dirname, '/public')));
app.use('/uploads', express.static('uploads'));

// dependencies call (middlewares)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cookieParser());

// global variables for flash messages and user
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// using routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/reservations', reservationsRouter);
app.use('/pets', petsRouter);
app.use('/datas', datasRouter);

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
  res.render('./pages/error');
});

module.exports = app;