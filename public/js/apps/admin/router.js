define(function(require, exports, module) {
	var setTitle = function(title) {
		$(document).find('title').text(title);
	};
	module.exports = Backbone.Router.extend({
		routes: {
			'': 'wxAccount',
			'account': 'wxAccount',
			'follower/:account': 'wxFollower',
      'text/:account': 'wxText',
			'news/:account': 'wxNews',
			'blog': 'Blog',
			'qgroup': 'QGroup',
			'qchoice/:group': 'QChoice'
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
        rel: account
      });
			setTitle('微信公众号粉丝维护');
		},
    wxText: function(account) {
      if(this.currentApp) this.currentApp.undelegateEvents();
      this.currentApp = require('apps/admin/modules/wxText/view/list')({
        rel: account
      });
      setTitle('微信公众号文本消息维护');
    },
		wxNews: function(account) {
			if(this.currentApp) this.currentApp.undelegateEvents();
			this.currentApp = require('apps/admin/modules/wxNews/view/list')({
				rel: account
			});
			setTitle('微信公众号图文消息维护');
		},
		Blog: function() {
			if(this.currentApp) this.currentApp.undelegateEvents();
			this.currentApp = require('apps/admin/modules/blog/view/list')();
			setTitle('博客列表');
		},
		QGroup: function() {
			if(this.currentApp) this.currentApp.undelegateEvents();
			this.currentApp = require('apps/admin/modules/qgroup/view/list')();
			setTitle('题库列表');
		},
		QChoice: function(group) {
			if(this.currentApp) this.currentApp.undelegateEvents();
			this.currentApp = require('apps/admin/modules/qchoice/view/list')({
				rel: group
			});
			setTitle('试题维护');
		}
	});
});