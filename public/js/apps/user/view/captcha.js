define(function(require, exports, module) {
	var View = Backbone.View.extend({
		tagName: 'div',
		className: 'row',
		template: require('apps/user/tpl/captcha.handlebars'),
		startUrl: '/captcha/start/5?r=',
		initialize: function(options) {},
		events: {
			'click .captcha-img': 'onSelectCaptcha'
		},
		render: function(callback) {
			var now = _.now(),
				self = this;
			$.getJSON(this.startUrl+now, function(data) {
				self.captcha = data;
				$(self.el).html( self.template({
					captcha: data,
					now: _.now()
				}) );
				if(_.isFunction(callback)) {
					callback(self.el);
				}
			});
		},
		onSelectCaptcha: function(e) {
			var self = this,
				me = $(e.target),
				cssClass = 'green lighten-3';
			$(self.el).find('.captcha-img').removeClass(cssClass);
			me.addClass(cssClass);
			$(self.el).find('.captcha-input').val( self.captcha.values[me.data('index')] );
		}
	});

	module.exports = function() {
		return (new View());
	};
});