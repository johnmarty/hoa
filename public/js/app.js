var app = app || null;

define([
  'jquery',
  'views/app',
  'models/user'

], function ($,	AppView, UserModel) {
  'use strict';

  // kick things off by creating the `App`
  // I basically have 3 mini apps not one
  if (!app) {
  	app = new AppView();
  } 

  // set the userprofile and state on the app
  app.userprofile = UserModel || {};
  if ( app.userprofile.has('firstname') ) {
    app.state = 'loggedin';
  } else {
    app.state = 'anonymous';
  }

  return app;

});
