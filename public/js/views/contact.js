define([
  'jquery',
  'backbone',
  'app',
  'mustache'
], function ($, Backbone, app, Mustache) {
	'use strict';

  var ContactView = Backbone.View.extend({

    el: '#app',

    template: null,

    events: {},

    initialize: function() {

      if (app.state == 'loggedin') {
        this.template = $("#contact").html();
      } else {
        this.template = $("#guest-contact").html();
      }
            
      this.listenTo(app.userprofile, 'change', this.render);

    },

    render: function(){

      this.$el.html(Mustache.render(this.template, app.userprofile.toJSON()));

    }

  });

  return ContactView;
});
