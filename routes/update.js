exports.merge = function(req, res){
  //eg: /update/meals_per_day/4
  var  db = require('../data/data')
  , doc = req.session.profile.username
  , jsonString = '{"'+req.params.key+'":"'+req.params.value+'"}'
  , obj = JSON.parse(jsonString)
  ;

  db.merge(doc, obj, function (err, res) {});
  
  res.send("done");
};
