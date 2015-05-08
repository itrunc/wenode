define(function(require, exports, module) {
	module.exports = Backbone.View.extend({
		tagName: 'button',
		className: 'modal-action waves-effect waves-green btn-flat',
		initialize: function(options) {
			var defaults = {
				label:  'Button',
				action: function(modal) {}
			};
			this.modal = options.modal;
			this.label = options.label || defaults.label;
			this.action = _.isFunction(options.action) ? options.action : defaults.action;
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