define(function(require, exports, module) {
	var View = Backbone.View.extend({
		el: '#menu',
		template: require('apps/admin/tpl/navbar.handlebars'),
		initialize: function(options) {
			this.menu = {
				brand: this.getAnchor('/', 'WeNode'),
				account: this.getAnchor('/admin#account', '公众号管理'),
				blog: this.getAnchor('/admin#blog', '文章管理'),
				qgroup: this.getAnchor('/admin#qgroup', '题库管理'),
				logout: this.getAnchor('/user/logout', 'Logout')
			};
			this.$el.html( this.template({
				brand: this.menu.brand,
				main: [
					this.menu.account
				],
				func: {
					label: '功能列表',
					items: [
						this.menu.blog,
						this.menu.qgroup
					]
				},
				side: [
					this.menu.account,
					this.menu.blog,
					this.menu.qgroup
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