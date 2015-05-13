define(function(require, exports, module) {
	module.exports = Backbone.View.extend({
		tagName: 'a',
		className: 'waves-effect waves-green btn',
		initialize: function(options) {
			var defaults = {
				label:  'Button',
				action: function(modal) {}
			};
			this.modal = options.modal;
			this.label = options.label || defaults.label;
			this.action = _.isFunction(options.action) ? options.action : defaults.action;
			if(options.cssClass) {
				$(this.el).addClass(options.cssClass);
			}
		},
		events: {
			'click': 'onClick'
		},
		render: function() {
			$(this.el).text(this.label);
			return this;
		},
		onClick: function(e) {
			var self = this;
			if(this.modal) {
				this.action.call(self, self.modal, e);
			} else {
				this.action.call(self, e);
			}
		}
	});
});