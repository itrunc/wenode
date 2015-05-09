define(function(require, exports, module) {
	module.exports = Backbone.View.extend({
		el: '#main',
		template: require('apps/user/tpl/login-form.handlebars'),
		initialize: function(options) {
			this.captcha = options.captcha;
			this.$el.html( this.template({
				captcha: this.captcha,
				now: _.now()
			}) );
		},
		events: {
			'click .captcha-img': 'onSelectCaptcha'
		},
		render: function() {},
		onSelectCaptcha: function(e) {
			var self = this,
				me = $(e.target),
				cssClass = 'green lighten-3';
			self.$el.find('.captcha-img').removeClass(cssClass);
			me.addClass(cssClass);
			self.$el.find('.captcha-input').val( self.captcha.values[me.data('index')] );
		}
	});
});