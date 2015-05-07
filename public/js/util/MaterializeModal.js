define(function(require, exports, module) {
	module.exports = Backbone.View.extend({
		tagName: 'div',
		className: 'modal modal-fixed-footer',
		template: '<div class="modal-content"></div><div class="modal-footer"></div>',
		initialize: function(options) {
			$(this.el).html(this.template);
			$('body').append(this.el);
		},
		render: function() {},
		show: function(msg) {
			$(this.el).find('.modal-content').text(msg);
			$(this.el).openModal({
				dismissible: true, // Modal can be dismissed by clicking outside of the modal
				opacity: .5, // Opacity of modal background
				in_duration: 300, // Transition in duration
				out_duration: 200, // Transition out duration
				ready: function() { alert('Ready'); }, // Callback for Modal open
				complete: function() { alert('Closed'); } // Callback for Modal close
			});
		}
	});
});