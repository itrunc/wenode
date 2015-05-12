define(function(require, exports, module) {
	var dialog = require('MDialog'),
		WechatFormView = require('apps/admin/modules/wxAccount/view/form');
	var toast = function(message) {
		Materialize.toast(message, 3000, 'red darken-1');
	};
	var View = Backbone.View.extend({
		tagName: 'li',
		className: '',//col s12 m4
		template: require('apps/admin/modules/wxAccount/tpl/item.handlebars'),
		initialize: function(options) {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},
		events: {
			'click .btn-remove': 'onDestroy',
			'click .btn-edit': 'onEdit'
		},
		render: function() {
			$(this.el).html( this.template({
				model: this.model.toJSON(),
				type: this.model.WechatType,
				method: this.model.EncryptMethod
			}, {helpers: require('handlebars-helper')}) );
			$(this.el).closest('#list').collapsible();
			
			return this;
		},
		onDestroy: function(e) {
			var self = this;
			dialog.confirm({
				title: '删除警告',
				message: '您将删除微信号：'+this.model.get('name')+'?',
				btnOKClass: 'btn-flat',
				btnOKLabel: '是',
				btnCancelClass: 'blue',
				btnCancelLabel: '否',
				callback: function(confirm) {
					if(confirm) {
						self.model.destroy({
							success: function(model, resp, options) {
								toast('删除成功');
							},
							error: function(model, resp, options) {
								toast(resp.responseText);
							},
							wait: true
						});
					}
				}
			});
		},
		onEdit: function(e) {
			var formView = new WechatFormView({
				model: this.model
			});
			dialog.show({
				title: '编辑微信公众号',
				message: formView.render().el,
				withFixedFooter: false,
				dismissible: false,
				buttons: [{
					label: '保存',
					action: function(modal) {
						formView.submit({
							success: function(obj,resp,opt) {
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