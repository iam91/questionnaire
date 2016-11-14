
/**
 * Module dependencies.
 */
var http = require('http');
var path = require('path');
var express = require('express')
var router = require('./routes/router');

var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var app = express();

// Configuration
app.set('port', 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(router);

if(app.get('env') === 'development'){
  app.use(errorHandler());
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
