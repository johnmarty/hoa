var cradle = require('cradle')
  , Config = require('../config/config')
  , config = new Config()
  ;

var db = new(cradle.Connection)(
		config.database.url, 
		config.database.port, 
		{
  			auth: {
	  			username: config.database.auth.user, 
	  			password: config.database.auth.pass
  			}
		}).database(config.database.dbname);

module.exports = db;