// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

// configuration
app.use(express.static('public'));
mongoose.connect(configDB.url, {
    useMongoClient: true
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// setup express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'anyrandomname'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes
require('./app/routes/main_routes.js')(app, passport); // load routes & pass in app and fully configured passport

app.listen(port);
console.log('The magic happens on port ' + port);