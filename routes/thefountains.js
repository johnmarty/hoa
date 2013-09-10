exports.thefountains = function(req, res) {
  var db = require('../data/data'); 
  var username = req.session.username;
  var stateLink = require('../modules/stateLink').init(username);

  if(username) {

    db.get( req.session.username, function (err, doc) {
      if(err) {
        res.status(404).render('error.ejs', { 
    	  error: "oops", 
    	  reason: JSON.stringify(err), 
    	  stateLinkUrl: stateLink.url,
    	  stateLinkCopy: stateLink.copy
        });
      }
      
      res.render('thefountains.ejs', {
        username: username,
        stateLinkUrl: stateLink.url,
        stateLinkCopy: stateLink.copy
      });

    });

  } else {

    res.render('thefountains.ejs', {
      username: '',
      stateLinkUrl: stateLink.url,
      stateLinkCopy: stateLink.copy
    });

  }  

};
