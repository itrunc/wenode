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
			var App = require('apps/user/view/login');
			$.getJSON(this.captchaUrl+_.now(), function(data) {
				self.currentApp = new App({
					captcha: data
				});
			});
			setTitle('用户登录');
		},
		registerPage: function() {
			var self = this;
			if(this.currentApp) this.currentApp.undelegateEvents();
			var App = require('apps/user/view/register');
			$.getJSON(this.captchaUrl+_.now(), function(data) {
				self.currentApp = new App({
					captcha: data
				});
			});
			setTitle('用户注册');
		},
		resetPage: function() {
			var self = this;
			if(this.currentApp) this.currentApp.undelegateEvents();
			var App = require('apps/user/view/reset');
			$.getJSON(this.captchaUrl+_.now(), function(data) {
				self.currentApp = new App({
					captcha: data
				});
			});
			setTitle('重置密码');
		},
		activatePage: function() {
			var self = this;
			if(this.currentApp) this.currentApp.undelegateEvents();
			var App = require('apps/user/view/activate');
			$.getJSON(this.captchaUrl+_.now(), function(data) {
				self.currentApp = new App({
					captcha: data
				});
			});
			setTitle('重新发送激活邮件');
		}
	});
});