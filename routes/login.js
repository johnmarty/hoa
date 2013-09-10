exports.authenticate = function(req, res) {
  var password = req.body.password
  , username = req.body.username
  , options = { 
      username: username, 
      password: password, 
      response: res,
      request: req,
      form: req.body 
    }
  , db = require('../data/data')
  , bcrypt = require('bcrypt-nodejs')
  ;

  if (username && password) {
    db.view('thefountains/user-profile'
      , { "key": options.username }
      , function (nothing, response) {
        if (response && response[0] && response[0].value) {
          var profile = response[0].value;
          dbhash = profile.password;
          if ( bcrypt.compareSync(options.password, dbhash) ) {
            options.request.session.username = options.username;
            options.response.redirect('/thefountains#/metabolic-profile');
          } else {
            options.request.flash('error', 'The username and password provided did not match our records.');
            options.response.redirect('/login');
          } 
        } else {
          options.request.flash('error', 'We did not find your profile are you sure you are registered?');
          console.log('is the db running?');
          options.response.redirect('/login');
        }
      }
    );
  } else {
    console.log('missing required username and password');
    options.response.send('login failed');
  }
};


exports.login = function(req, res) {
  var username = req.session.username || ""
  , profile = req.session.profile || {}
  ;
  var stateLink = require('../modules/stateLink').init(username);

  console.log(req.session);
  message = req.flash('error');
  res.render('login.ejs', {
    username: username,
    profile: JSON.stringify(profile),
    error: message,
    stateLinkUrl: stateLink.url,
    stateLinkCopy: stateLink.copy
  });
};

exports.logout = function(req, res) {
  req.session = null
  var username = ""
  , profile =  {}
  , stateLink = require('../modules/stateLink').init();
  ;

  console.log('user logged out deleted session');
  res.render('logout.ejs', {
    username: username,
    profile: JSON.stringify(profile),
    stateLinkUrl: stateLink.url,
    stateLinkCopy: stateLink.copy
  });
};