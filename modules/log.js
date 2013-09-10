exports.log = function(options) {
  var Config = require('../config/config')
  , config = new Config()
  ;
  if(options.level <= config.log.level) {
  	  console.log(options.msg)
	  if(options.obj){
	  	console.log(options.obj);
	  }
  }
};

