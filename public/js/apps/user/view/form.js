define(function(require, exports, module) {

	var Captcha = require('apps/user/view/captcha'),
		Dialog = require('MDialog');

	var View = Backbone.View.extend({
		el: '#main',
		initialize: function(options) {
			var self = this;
			this.template = options.template;
			this.captcha = options.captcha;
			if(this.template) {
				if(_.isFunction(this.template)) {
					this.$el.html( this.template() );
				} else {
					this.$el.html( this.template );
				}
			}
			if(this.captcha) this.resetCaptcha();
		},
		events: {
			'submit form': 'onSubmit'
		},
		render: function() {},
		resetCaptcha: function() {
			var self = this;
			if(this.captchaView) this.captchaView.remove();
			this.captchaView = Captcha();
			this.captchaView.render(function(content) {
				self.$el.find('.input-captcha').html(content);
			});
		},
		onSubmit: function(e) {
			var self = this;
			e.preventDefault(); // prevent native submit
			var form = $(e.target).ajaxSubmit();
			var xhr = form.data('jqxhr');
			xhr.done(function() {
				var data = xhr.responseJSON;
				if(data) {
					var dialog = Dialog.show({
						dismissible: false,
						title: data.title,
						message: data.message
					});
					if(data.url) setTimeout(function(){
						dialog.close();
						window.location.href = data.url;
					}, 2000);
				} else {
					window.location.href=xhr.responseText;
				}
			}).fail(function() {
				console.log(xhr);
				Materialize.toast(xhr.responseText, 3000, 'red darken-1')
				if(self.captcha) self.resetCaptcha();
			});
		}
	});

	module.exports = function(options) {
		return (new View(options));
	};
});