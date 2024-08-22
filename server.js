var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var cors = require('cors');

var securityMiddleware = require('./middlewares/security');

require("dotenv").config();
require("./client/users");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');
var ordersRouter = require('./routes/orders');
var cloudinaryRouter = require('./client/cloudinary');
var snipcartRouter = require('./client/snipcart');
var finderRouter = require('./routes/finder');

var app = express();

// CORS configuration (initial)
// app.use(cors({
//   origin: '*', // Allow any origin
//   methods: 'GET,POST,PUT,DELETE,OPTIONS',
//   allowedHeaders: 'Content-Type, Authorization, x-snipcart-publicapikey, x-snipcart-referer',
//   credentials: true,
// }));

// Middleware for setting CORS headers and preflight requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://jippy.home.ngrok.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE");
  res.setHeader("Access-Control-Allow-Headers", 
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  res.setHeader("Access-Control-Max-Age", 7200);
  next();
});

// Preflight request handler
app.options("*", (req, res) => {
  console.log("Preflight request detected");
  const allowMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
  const allowHeaders = ["content-type", "authorization", "x-snipcart-publicapikey", "x-snipcart-referer"];

  if (
    req.headers.origin === "https://jippy.home.ngrok.app" &&
    allowMethods.includes(req.headers["access-control-request-method"]) &&
    allowHeaders.includes(req.headers["access-control-request-headers"])
  ) {
    console.log("Preflight passed");
    return res.status(204).send();
  } else {
    console.log("Preflight failed");
    return res.status(403).send('CORS check failed');
  }
});

// Middleware for logging, parsing, and security
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(securityMiddleware.checkJWT);

// Route handlers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
app.use('/cloudinary', cloudinaryRouter);
app.use('/snipcart', snipcartRouter);
app.use('/finder', finderRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
