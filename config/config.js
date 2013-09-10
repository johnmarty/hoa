module.exports = function(){
	var devConfig = {
    		server: {
    			port: 7000
    		},
    		database: {
				dbname: "thefountains",
				url: "http://127.0.0.1",
				port: "5984",        				
    			auth: {
    				user: "evoadmin",
    				pass: "evoadmin"
    			}
    		},
            log: {
                // 0 fatal, 1 recoverable, 2 debug
                level: 0
            }
        },
        prodConfig = {
            server: {
                port: 0
            },
            database: {
                dbname: "thefountains",
                url: "https://nodejitsudb1532852894.iriscouch.com",
                port: "6984",                       
                auth: {
                    user: "evoadmin",
                    pass: "evoadmin"
                }
            },
            log: {
                // 0 fatal, 1 recoverable, 2 debug
                level: 3
            }
		};

    switch(process.env.NODE_ENV){
        case 'development':
            return devConfig;
        case 'production':
            return prodConfig;
        default:
            return devConfig;
    }
};