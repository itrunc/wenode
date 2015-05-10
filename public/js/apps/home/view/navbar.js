define(function(require, exports, module) {
	module.exports = Backbone.View.extend({
		el: '#home-menu',
		template: require('apps/home/tpl/navbar.handlebars'),
		initialize: function(options) {
			this.menu = {
				brand: this.getAnchor('/', 'WeNode'),
				admin: this.getAnchor('/admin', 'Admin'),
				login: this.getAnchor('/user#signin', 'Login'),
				register: this.getAnchor('/user#signup', 'Register')
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
						this.menu.login, 
						this.menu.register
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
});