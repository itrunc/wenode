define(function(require, exports, module) {
	//var Navbar = require('apps/home/view/navbar');
	module.exports = Backbone.Router.extend({
		routes: {
			'': 'indexPage'
		},
		initialize: function() {
			var Navbar = require('apps/home/view/navbar');
			new Navbar;
		},
		indexPage: function() {
			//alert('indexPage');
		}
	});
});