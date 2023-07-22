var createError = require('http-errors');
var express = require('express');

var dealer = require('./routes/dealer');
var review = require('./routes/review');

var app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/dealer', dealer);
app.use('/review', review);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;