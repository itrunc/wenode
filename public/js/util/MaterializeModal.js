define(function(require, exports, module) {
	var MButton = require('MButton');
	var Modal = Backbone.View.extend({
		tagName: 'div',
		className: 'modal modal-fixed-footer',
		template: '<div class="modal-content"><h3 class="modal-header"></h3><div class="modal-body"></div></div><div class="modal-footer"></div>',
		initialize: function(options) {
			var self = this;
			options = options || {};
			var defaults = {
				title: 'Dialog',
				message: '',
				buttons: [],
				dismissible: true,
				opacity: .5,
				in_duration: 300,
				out_duration: 200,
				autodestroy: true
			};
			var config = {
				dismissible: options.dismissible==undefined ? defaults.dismissible : options.dismissible,
				opacity: options.opacity || defaults.opacity,
				in_duration: options.in_duration || defaults.in_duration,
				out_duration: options.out_duration || defaults.out_duration,
				ready: _.isFunction(options.onOpen) ? options.onOpen : defaults.onOpen,
				complete: _.isFunction(options.onClosed) ? options.onClosed : defaults.onClosed
			}
			this.autodestroy = options.autodestroy==undefined ? defaults.autodestroy : options.autodestroy;
			var el = $(this.el);
			el.html(this.template);
			el.find('.modal-header').html(options.title || defaults.title);
			el.find('.modal-body').html(options.message || defaults.message);
			if(options.buttons && options.buttons.length > 0) {
				for(var i in options.buttons) {
					var btn = new MButton({
						modal: self,
						label: options.buttons[i].label,
						action: options.buttons[i].action,
						cssClass: options.buttons[i].cssClass
					});
					el.find('.modal-footer').append(btn.render().el);
				}
			}
			$('body').append(this.el);
			$(this.el).openModal(config);
		},
		close: function() {
			$(this.el).closeModal();
			if(this.autodestroy) this.remove();
		}
	});

	module.exports = {
		alert: function(message, title, label) {
			var modal = new Modal({
				title: title,
				message: message,
				dismissible: false,
				buttons: [{
					label: label,
					action: function(modal) {
						modal.close();
					}
				}]
			});
		},
		confirm: function(options) {
			options = options || {};
			var modal = new Modal({
				title: options.title || 'Confirm',
				message: options.message || '?',
				buttons: [{
					label: options.btnCancelLabel || 'Cancel',
					action: function(modal) {
						if(options.callback && _.isFunction(options.callback)) {
							options.callback(false);
						}
						modal.close();
					}
				}, {
					label: options.btnOKLabel || 'OK',
					cssClass: options.btnOKClass || 'teal lighten-2',
					action: function(modal) {
						if(options.callback && _.isFunction(options.callback)) {
							options.callback(true);
						}
						modal.close();
					}
				}]
			});
		}
	};

});