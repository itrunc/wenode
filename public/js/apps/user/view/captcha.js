define(function(require, exports, module) {
	var View = Backbone.View.extend({
		tagName: 'div',
		className: 'row',
		template: require('apps/user/tpl/captcha.handlebars'),
		initialize: function(options) {
			this.captcha = options.captcha;
		},
		events: {
			'click .captcha-img': 'onSelectCaptcha'
		},
		render: function() {
			$(this.el).html( this.template({
				captcha: this.captcha,
				now: _.now()
			}) );
			return this;
		},
		onSelectCaptcha: function(e) {
			var self = this,
				me = $(e.target),
				cssClass = 'green lighten-3';
			self.$el.find('.captcha-img').removeClass(cssClass);
			me.addClass(cssClass);
			self.$el.find('.captcha-input').val( self.captcha.values[me.data('index')] );
		}
	});

	module.exports = function(options) {
		return (new View(options));
	};
});