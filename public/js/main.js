'use strict';

// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		backboneLocalstorage: {
			deps: ['backbone'],
			exports: 'Store'
		}
	},
	paths: {
		backbone: '/public/library/backbone/backbone-min',
		backboneLocalstorage: '/public/library/backbone.localStorage/backbone.localStorage',
		jquery: '/public/library/jquery/jquery-1.9.1',
		json2: '/public/library/json2/json2',
		mustache: '/public/library/mustache/mustache',
		text: '/public/library/requirejs-text/text',
		underscore: '/public/library/underscore/underscore-min',
		app: 'app'
	}
});

require(
[
	'backbone',
	'json2',
	'app',
	'routers/router',
	'views/newsletter',
	'views/contact',
	'views/calendar'
], 
function (
	Backbone, 
	JSON,
	app,
	Workspace, 
	NewsletterView, 
	ContactView,
	CalendarView 
	) 
{

	// Initialize routing and start Backbone.history()
	var workspace = new Workspace();
    workspace
	    .on('route:newsletter', function() {
	      var view = new NewsletterView();
	      view.render();
	    })
	    .on('route:contact', function() {
	      var view = new ContactView();
	      view.render();
	    })
	    .on('route:calendar', function() {
	    	var view = new CalendarView();
	    	view.render();
	    })
	;
	    
	Backbone.history.start();
});
