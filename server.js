// setting up requirements..

var express           = require('express'),
    morgan            = require('morgan'),
    bodyParser        = require('body-parser'),
    ejs               = require('ejs'),
    expressEjsLayouts = require('express-ejs-layouts'),
    methodOverride    = require('method-override');

// server setup
var PORT    = process.env.PORT || 4646,
    server  = express();

// setting up mongoose stuff -- but might not actually need this, may not persist data.

// var MONGOURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
//     dbname   = "rip-nyc",
//     mongoose = require('mongoose'),
//     Schema   = mongoose.Schema;

// SET

// mongoose.set('debug', true);

server.set('views', './views');
server.set('view engine', 'ejs');

// USE

server.use(morgan('dev'));

server.use(express.static('./public'));

server.use(expressEjsLayouts);

server.use(bodyParser.urlencoded({
  extended: true
}));

server.use(methodOverride('_method'));

// SUPER LOGGER

server.use(function(req, res, next){
  console.log("*************** [ REQ START ] ***************");
  console.log("REQ DOT BODY: \n", req.body);
  console.log("REQ DOT PARAMS: \n", req.params);
  console.log("*************** [ REQ END ] ***************");
  next();
});

// specific routes--starting with a test one

server.get('/wicked-secret-test', function(req, res){
  res.write("welcome to my craptastic app!");
  res.end();
});

server.get('/', function(req, res){
  res.render('home');
});

//////////////////////
// MORE ROUTES HERE //
//////////////////////

// failsafe in case someone gets to where they're not supposed to be..

server.use(function(req, res, next){
  res.write("You've reached the end of the road, pal.");
  res.end();
});

// server listen and mongoose connect.. but might not need mongoose.

// mongoose.connect(MONGOURI + "/" + dbname, function(){
//   console.log("DATABASE IS UP!");
// });
server.listen(PORT, function() {
  console.log("SERVER IS UP ON PORT: ", PORT);
});
