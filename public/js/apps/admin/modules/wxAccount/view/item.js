define(function(require, exports, module) {
	var View = Backbone.View.extend({
		tagName: 'div',
		className: 'col s6',
		template: require('apps/admin/modules/wxAccount/tpl/item.handlebars'),
		initialize: function(options) { },
		events: { },
		render: function() {
			$(this.el).html( this.template() );
			return this;
		}
	});

	module.exports = function(options) {
		return ( new View(options) );
	}
});