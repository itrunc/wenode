define(function(require, exports, module) {

	var View = Backbone.View.extend({
		el: '#main',
		initialize: function(options) {
			this.template = options.template;
			this.captcha = options.captcha;
			if(this.template) {
				if(_.isFunction(this.template)) {
					this.$el.html( this.template() );
				} else {
					this.$el.html( this.template );
				}
			}
			if(this.captcha) {
				var captcha = require('apps/user/view/captcha') ({
					captcha: this.captcha
				});
				this.$el.find('.input-captcha').html(captcha.render().el);
			}
		},
		events: {},
		render: function() {}
	});

	module.exports = function(options) {
		return (new View(options));
	};
});