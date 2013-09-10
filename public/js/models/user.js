define([
  'backbone'
], function (Backbone) {
	'use strict';

    // We extend the Backbone.Model prototype to build our own
    var UserModel = Backbone.Model.extend({

		// We can pass it default values.
		defaults : {},

		url : function() {
			return username ? '/user/' + username : ''; 

		},

		initialize: function () {
			//console.log('hey');
			//this.fetch();
		}
     
    });

    return new UserModel();

});