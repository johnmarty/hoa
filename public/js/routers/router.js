define(
  ['jquery','backbone'], 
  function($, Backbone){
    'use strict';

    var Workspace = Backbone.Router.extend({
      routes: {
        "newsletter": "newsletter",
        "contact": "contact",
        "calendar": "calendar"
      }
    });

    return Workspace;
  }
  
);