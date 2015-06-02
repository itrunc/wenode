define(function(require, exports, module) {
	var View = require('apps/admin/view/IList').extend({
		template: require('apps/admin/modules/wxAccount/tpl/list.html'),
		Collection: require('apps/admin/modules/wxAccount/collection/WechatCollection'),
		Model: require('model/Wechat'),
		ItemView: require('apps/admin/modules/wxAccount/view/item'),
		FormView: require('apps/admin/modules/wxAccount/view/form'),
		addOne: function(model) {
			var view = this.ItemView({
				model: model
			});
			this.$el.find('#list').append(view.render().el);
			this.$el.find('#list').collapsible();
		}
	});

	module.exports = function(options) {
		return ( new View(options) );
	}
});