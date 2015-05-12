define(function(require, exports, module) {
	var View = Backbone.View.extend({
		el: '#menu',
		template: require('apps/admin/tpl/navbar.handlebars'),
		initialize: function(options) {
			this.menu = {
				brand: this.getAnchor('/', 'WeNode'),
				admin: this.getAnchor('/admin', 'Admin'),
				logout: this.getAnchor('/user/logout', 'Logout')
			};
			this.$el.html( this.template({
				brand: this.menu.brand,
				main: [
					this.menu.admin
				],
				side: [
					this.menu.admin
				],
				user: {
					label: 'User',
					items: [
						this.menu.logout
					]
				}
			}) );
			this.$el.find('.button-collapse').sideNav();
			this.$el.find(".dropdown-button").dropdown();
		},
		events: { },
		render: function() {},
		getAnchor: function(link, label) {
			return { link: link, label: label }
		}
	});

	module.exports = function(options) {
		return ( new View(options) );
	}
});