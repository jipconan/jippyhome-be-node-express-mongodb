var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

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

// Define allowed origins
const allowedOrigins = [
  'https://snail-equal-vastly.ngrok-free.app',
  'http://localhost:5173',
  'https://app.snipcart.com' 
];

// app.use(cors());
// Configure CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(securityMiddleware.checkJWT); 

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
app.use('/cloudinary', cloudinaryRouter);
app.use('/snipcart', snipcartRouter);
app.use('/finder', finderRouter);

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
