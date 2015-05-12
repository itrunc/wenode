define(function(require, exports, module) {
	var dialog = require('MDialog'),
		WechatModel = require('model/Wechat'),
		WechatFormView = require('apps/admin/modules/wxAccount/view/form');
	var toast = function(message) {
		Materialize.toast(message, 3000, 'red darken-1');
	};
	var View = Backbone.View.extend({
		el: '#main',
		template: require('apps/admin/modules/wxAccount/tpl/list.html'),
		initialize: function(options) {
			this.$el.html( this.template );

			this.list = require('apps/admin/modules/wxAccount/collection/WechatCollection')().collection;
			this.listenTo(this.list, 'add', this.addOne);
			this.listenTo(this.list, 'reset', this.addAll);
			this.listenTo(this.list, 'all', this.render);

			this.list.fetch({
				success: function(results, resp, opt) {
					console.log(results, resp, opt);
				},
				error: function(results, resp, opt) {
					toast(resp.responseText);
				}
			});
		},
		events: {
			'click #btn-create': 'onCreate'
		},
		render: function() {},
		addOne: function(model) {
			var view = require('apps/admin/modules/wxAccount/view/item')({
				model: model
			});
			this.$el.find('#list').append(view.render().el);

			this.$el.find('#list').collapsible();
		},
		addAll: function() {
			this.list.each(this.addOne, this);
		},
		onCreate: function(e) {
			var self = this;
			var wechat = new WechatModel;
			wechat.collection = this.list;
			var formView = new WechatFormView({
				model: wechat
			});
			dialog.show({
				title: '添加微信公众号',
				message: formView.render().el,
				withFixedFooter: false,
				dismissible: false,
				buttons: [{
					label: '保存',
					action: function(modal) {
						formView.submit({
							success: function(obj,resp,opt) {
								self.list.add(formView.model);
								modal.close();
							}
						});
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