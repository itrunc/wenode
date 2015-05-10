define(function(require) {
	var App = require('apps/admin/router');
	new App;
	Backbone.history.start();
});