define([
  'jquery',
  'backbone',
  'app',
  'mustache'
], function ($, Backbone, app, Mustache) {
	'use strict';

  var CalendarView = Backbone.View.extend({

    el: '#app',

    template: null,

    events: {},

    initialize: function() {

      if (app.state == 'loggedin') {
        this.template = $("#calendar").html();
      } else {
        this.template = $("#guest-calendar").html();
      }
            
      this.listenTo(app.userprofile, 'change', this.render);

    },

    render: function(){

      this.$el.html(Mustache.render(this.template, app.userprofile.toJSON()));

    }

  });

  return CalendarView;
});
