define(function(require) {
	var App = require('apps/user/router');
	new App;
	Backbone.history.start();
});