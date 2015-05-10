define(function(require, exports, module) {
	var Collection = Backbone.Collection.extend({
		model: require('model/Wechat'),
		url: '/admin/model/wechat'
	});

	module.exports = function() {
		return {
			collection: new Collection
		};
	};
});