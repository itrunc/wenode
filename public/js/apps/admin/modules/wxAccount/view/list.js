define(function(require, exports, module) {
	var View = Backbone.View.extend({
		el: '#main',
		template: '<div id="list" class="row"></div>',
		initialize: function(options) {
			this.$el.html( this.template );

			this.list = require('apps/admin/modules/wxAccount/collection/WechatCollection')().collection;
			this.listenTo(this.list, 'add', this.addOne);
			this.listenTo(this.list, 'reset', this.addAll);
			this.listenTo(this.list, 'all', this.render);

			//TODO: fetch
		},
		events: { },
		render: function() {},
		addOne: function(obj) {
			var view = require('apps/admin/modules/wxAccount/view/item')();
			this.$el.find('#list').append(view.render().el);
		},
		addAll: function() {
			this.list.each(this.addOne, this);
		}
	});

	module.exports = function(options) {
		return ( new View(options) );
	}
});