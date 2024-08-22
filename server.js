var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const axios = require('axios');

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

// app.use(cors());
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(securityMiddleware.checkJWT); 

// Proxy endpoint to Snipcart
app.use('/api/proxy/snipcart/*', async (req, res) => {
  try {
    // Build the full Snipcart URL
    const snipcartUrl = `https://app.snipcart.com${req.originalUrl.replace('/api/proxy/snipcart', '')}`;

    // Forward the request to Snipcart
    const response = await axios({
      method: req.method,
      url: snipcartUrl,
      headers: req.headers,
      data: req.body,
    });

    // Send the response back to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    // Handle errors
    res.status(error.response?.status || 500).json(error.response?.data || 'Error');
  }
});

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
