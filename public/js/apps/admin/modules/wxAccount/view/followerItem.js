define(function(require, exports, module) {
  var dialog = require('MDialog'),
      WechatFormView = require('apps/admin/modules/wxAccount/view/form');
  var View = Backbone.View.extend({
    tagName: 'tr',
    template: require('apps/admin/modules/wxAccount/tpl/followerItem.handlebars'),
    initialize: function(options) {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
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