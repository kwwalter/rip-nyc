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
  console.log("RES DOT LOCALS: \n", res.locals);
  console.log("REQ DOT BODY: \n", req.body);
  console.log("REQ DOT PARAMS: \n", req.params);
  console.log("*************** [ REQ END ] ***************");
  next();
});

// route for home
server.get('/', function(req, res){
  res.render('home');
});

// failsafe in case someone gets to where they're not supposed to be..
server.use(function(req, res, next){
  res.write("You\'ve reached the end of the road, pal.");
  res.end();
});

// server listen
server.listen(PORT, function() {
  console.log("SERVER IS UP ON PORT: ", PORT);
});
