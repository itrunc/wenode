define(function(require, exports, module) {
  var dialog = require('MDialog');
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
            dialog.toast('保存成功');
					},
					error: function(obj, resp, opt) {
						//console.log(obj, resp, opt);
            dialog.toast(resp.responseText);
					}
				});
			} else {
        dialog.toast(this.model.validationError);
			}
		}
	});

	module.exports = function(options) {
		return ( new View(options) );
	}
});