define(function(require, exports, module) {
  var dialog = require('MDialog'),
    AccountModel = require('model/Wechat');

  var View = Backbone.View.extend({
    el: '#main',
    template: require('apps/admin/modules/wxAccount/tpl/fansList.html'),
    initialize: function(options) {
      this.$el.html( this.template );
    },
    events: {},
    render: function() {}
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});