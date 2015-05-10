define(function(require, exports, module) {
	var setTitle = function(title) {
		$(document).find('title').text(title);
	};
	module.exports = Backbone.Router.extend({
		routes: {
			'signin': 'loginPage',
			'signup': 'registerPage',
			'reset': 'resetPage',
			'activate': 'activatePage'
		},
		currentApp: null,
		captchaUrl: '/captcha/start/5?r=',
		initialize: function() {},
		loginPage: function() {
			var self = this;
			if(self.currentApp) self.currentApp.undelegateEvents();
			$.getJSON(this.captchaUrl+_.now(), function(data) {
				self.currentApp = require('apps/user/view/form')({
					captcha: data,
					template: require('apps/user/tpl/login-form.handlebars')
				});
			});
			setTitle('用户登录');
		},
		registerPage: function() {
			var self = this;
			if(this.currentApp) this.currentApp.undelegateEvents();
			$.getJSON(this.captchaUrl+_.now(), function(data) {
				self.currentApp = require('apps/user/view/form')({
					captcha: data,
					template: require('apps/user/tpl/register-form.handlebars')
				});
			});
			setTitle('用户注册');
		},
		resetPage: function() {
			var self = this;
			if(this.currentApp) this.currentApp.undelegateEvents();
			$.getJSON(this.captchaUrl+_.now(), function(data) {
				self.currentApp = require('apps/user/view/form')({
					captcha: data,
					template: require('apps/user/tpl/reset-form.handlebars')
				});
			});
			setTitle('重置密码');
		},
		activatePage: function() {
			var self = this;
			if(this.currentApp) this.currentApp.undelegateEvents();
			$.getJSON(this.captchaUrl+_.now(), function(data) {
				self.currentApp = require('apps/user/view/form')({
					captcha: data,
					template: require('apps/user/tpl/activate-form.handlebars')
				});
			});
			setTitle('重新发送激活邮件');
		}
	});
});