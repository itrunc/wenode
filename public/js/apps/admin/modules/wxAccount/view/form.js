define(function(require, exports, module) {
	var toast = function(message) {
		Materialize.toast(message, 3000, 'red darken-1');
	};
	var View = Backbone.View.extend({
		tagName: 'form',
		className: '',
		template: require('apps/admin/modules/wxAccount/tpl/form.handlebars'),
		initialize: function(options) { },
		events: { },
		render: function() {
			$(this.el).html( this.template({
				model: this.model.toJSON(),
				type: this.model.WechatType,
				method: this.model.EncryptMethod,
				isEdit: !this.model.isNew()
			}, {helpers: require('handlebars-helper')}) );
			$(this.el).find('select').material_select();
			return this;
		},
		submit: function(options) {
			options = options || {};
			var data = $(this.el).serializeJSON();
			this.model.set(data);
			if(this.model.isValid()) {
				this.model.save(null, {
					success: function(obj, resp, opt) {
						if(options.success && _.isFunction(options.success)) options.success(obj,resp,opt);
						toast('保存成功');
					},
					error: function(obj, resp, opt) {
						//console.log(obj, resp, opt);
						toast(resp.responseText);
					}
				});
			} else {
				toast(this.model.validationError);
			}
		}
	});

	module.exports = function(options) {
		return ( new View(options) );
	}
});