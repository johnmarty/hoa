define([
  'jquery',
  'underscore',
  'backbone',
  'app'
  ], function($, _, Backbone, app){
    'use strict';

    // Our overall **AppView** is the top-level piece of UI.
    var AppView = Backbone.View.extend({

      recipeView: null,
      recipesView: null,

      // Instead of generating a new element, bind to the existing skeleton of
      // the App already present in the HTML.
      el: '#app',

      // Delegated global events
      events: {},

      initialize: function () {},

      render: function () {},

    });

    return AppView;

  }
);
