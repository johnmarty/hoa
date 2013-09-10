var express = require('express')
  , flash = require('connect-flash')
  , routes = require('./routes')
  , login = require('./routes/login')
  , thefountains = require('./routes/thefountains')
  , registration = require('./routes/registration')
  , update = require('./routes/update')
  , api = require('./routes/api')
  , Config = require('./config/config')
  , config = new Config()
  ;

var app = express();
app.use('/public', express.static('public'));
// ignore GET /favicon.ico
app.use(express.favicon());
// gzip
app.use(express.compress());
// parse the body for params
app.use(express.bodyParser());
//flash messaging
app.use(flash());
// turn on cookie middleware
app.use(express.cookieParser());
// turn on sessions, must go after cookie
app.use(express.cookieSession({ 
  key: 'thefountains', 
  secret: 'cookiesecret', 
  cookie: { 
    maxAge: null, 
    httpOnly: true 
  }
}));

// simple logger
app.use(function(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
});

// order is important here
app.get('/', routes.index);

  app.get('/login', login.login);
  app.post('/login', login.authenticate);
  app.get('/logout', login.logout);
  app.get('/register', registration.register);
  app.post('/register', registration.registrationConfirmation);
  app.get('/update/:key/:value', update.merge);
  app.get('/users', api.users);
  app.get('/user/:name', api.getUser);
  app.post('/user/:name', api.updateUser);
  app.get('/thefountains', thefountains.thefountains);
  app.get('/api/db-view/:name', api.dbView);

app.get('/*', function(req, res) {
  res.status(404).render('error.ejs', { 
    error: "The page you are looking doesn't exist", 
    reason: "We haven't thought of it yet.",
    username: "hmm",
    profile: {} 
  });
});

app.listen(config.server.port);
console.log('The Fountains at Crystal Creek Server Running');

