define(function(require, exports, module) {
  var dialog = require('MDialog');
  var View = Backbone.View.extend({
    tagName: 'form',
    className: '',
    template: require('apps/admin/modules/wxText/tpl/form.handlebars'),
    initialize: function(options) {
    },
    events: {},
    render: function() {
      var model = this.model.toJSON();
      $(this.el).html( this.template({
        model: model
      }, {helpers: require('handlebars-helper')}) );
      return this;
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});