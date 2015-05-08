define(function(require) {
	var App = require('apps/home/router');
	new App;
	Backbone.history.start();
});