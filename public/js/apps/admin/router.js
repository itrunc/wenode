define(function(require, exports, module) {
	var setTitle = function(title) {
		$(document).find('title').text(title);
	};
	module.exports = Backbone.Router.extend({
		routes: {
			'': 'wxAccount',
			'account': 'wxAccount',
			'keyword/:account': 'wxKeyword',
			'fans/:account': 'wxFans',
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
		wxKeyword: function() {
			if(this.currentApp) this.currentApp.undelegateEvents();
			this.currentApp = require('apps/admin/modules/wxAccount/view/keyword')();
			setTitle('微信公众号关键字维护');
		},
		wxFans: function(account) {
			if(this.currentApp) this.currentApp.undelegateEvents();
			this.currentApp = require('apps/admin/modules/wxAccount/view/followerList')({
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