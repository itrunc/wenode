define(function(require, exports, module) {
	var dialog = require('MDialog'),
		WechatModel = require('model/Wechat'),
		WechatFormView = require('apps/admin/modules/wxAccount/view/form');
	var View = Backbone.View.extend({
		el: '#main',
		template: require('apps/admin/modules/wxAccount/tpl/list.html'),
		initialize: function(options) {
			this.$el.html( this.template );

			this.list = require('apps/admin/modules/wxAccount/collection/WechatCollection')().collection;
			this.listenTo(this.list, 'add', this.addOne);
			this.listenTo(this.list, 'reset', this.addAll);
			this.listenTo(this.list, 'all', this.render);

			//TODO: fetch
		},
		events: {
			'click #btn-create': 'onCreate'
		},
		render: function() {},
		addOne: function(obj) {
			var view = require('apps/admin/modules/wxAccount/view/item')();
			this.$el.find('#list').append(view.render().el);
		},
		addAll: function() {
			this.list.each(this.addOne, this);
		},
		onCreate: function(e) {
			var formView = new WechatFormView({
				model: new WechatModel
			});
			dialog.show({
				title: '添加微信公众号',
				message: formView.render().el,
				withFixedFooter: false,
				dismissible: false,
				buttons: [{
					label: '保存',
					action: function() {
						formView.submit();
					}
				}, {
					label: '取消',
					cssClass: 'btn-flat',
					action: function(modal) {
						modal.close();
					}
				}]
			});
		}
	});

	module.exports = function(options) {
		return ( new View(options) );
	}
});