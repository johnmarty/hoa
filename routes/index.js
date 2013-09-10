exports.index = function(req, res) {
  var username = req.session.username || ""
  , profile = req.session.profile || {}
  , lastvisited =''
  , stateLink = require('../modules/stateLink').init(username);
  ;

  if(req.session.lastPage) {
    lastvisited = req.session.lastPage;
  }

  req.session.lastPage = '/';

  if(profile) {
  
    res.render('homepage.ejs', {
      stateLinkUrl: stateLink.url,
      stateLinkCopy: stateLink.copy,
      lastvisited: lastvisited,
      username: username,
      profile: JSON.stringify(profile)
    });

  } else {

    res.render('guest-homepage.ejs', {
      stateLinkUrl: stateLink.url,
      stateLinkCopy: stateLink.copy,
      lastvisited: lastvisited,
      username: username,
      profile: JSON.stringify(profile)
    });
  
  }
};
