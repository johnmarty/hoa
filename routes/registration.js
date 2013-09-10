exports.register = function(req, res) {
  var username = req.session.username || ""
  , profile = req.session.profile || {}
  , stateLink = require('../modules/stateLink').init(username);
  ;
  res.render('registration.ejs', {
    stateLinkUrl: stateLink.url,
    stateLinkCopy: stateLink.copy,
    username: username,
    profile: JSON.stringify(profile)

  });
};

exports.registrationConfirmation = function(req, res) {
  var password = req.body.password
  ,   username = req.body.username
  ,   options = { 
        username: username, 
        password: password, 
        response: res,
        form: req.body 
      }
  ,   db = require('../data/data')
  ,   bcrypt = require('bcrypt-nodejs')
  ,   stateLink = require('../modules/stateLink').init(username);
  ;

  if (username && password) {
    db.view('thefountains/user-profile'
      , { "key": options.username }
      , function (nothing, response) {
          if (response && response[0] && response[0].value) {
              options.response.render('error.ejs', {
                title: 'thefountains myBody', 
                h1: 'thefountains myBody',
                headline: 'because eVeryBody is unique',
                error: 'Cannot create accout.',
                username: options.username,
                reason: 'Username already exists: ',
                profile: {}
              });

          } else {
          	//username not found, good, lets add it
          	bcrypt.hash(options.password, null, null, function(err, hash) {
            	// Add type for db view
  			      options.form.docType = "user-profile";
  			      // Store hash in your password DB.
  			      options.form.password = hash;
  			      //console.log(options.form);
  			      db.save(options.username, options.form , function (err, res) {
  			      	if (err) {
   		      			console.log("error saving profile to db");
   		      			console.log(err);
  			      	} else {
  			      		console.log('db save successful');
                    var obj = req.body
                    ;
                    obj.stateLinkUrl = stateLink.url;
                    obj.stateLinkCopy = stateLink.copy;

                    obj.profile = req.session.profile || {}

  					      //update request body password with hash
  					      options.response.render('registration-confirmation.ejs', obj);
  				      }
  				    });

			      });

          } 
        }
    );

  }
};