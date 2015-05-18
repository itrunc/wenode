define(function(require, exports, module) {
	var setTitle = function(title) {
		$(document).find('title').text(title);
	};
	module.exports = Backbone.Router.extend({
		routes: {
			'': 'wxAccount',
			'account': 'wxAccount',
			'follower/:account': 'wxFollower',
      'text/:account': 'wxText'
		},
		currentApp: null,
		initialize: function() {
			this.navbar = require('apps/admin/view/navbar')();
		},
		wxAccount: function() {
			if(this.currentApp) this.currentApp.undelegateEvents();
			this.currentApp = require('apps/admin/modules/wxAccount/view/list')();
			setTitle('微信公众号列表');
		},
		wxFollower: function(account) {
			if(this.currentApp) this.currentApp.undelegateEvents();
			this.currentApp = require('apps/admin/modules/wxFollower/view/list')({
        account: account
      });
			setTitle('微信公众号粉丝维护');
		},
    wxText: function(account) {
      if(this.currentApp) this.currentApp.undelegateEvents();
      this.currentApp = require('apps/admin/modules/wxText/view/list')({
        account: account
      });
      setTitle('微信公众号文本消息维护');
    }
	});
});