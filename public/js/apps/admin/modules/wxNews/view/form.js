define(function(require, exports, module) {
  var dialog = require('MDialog');
  var View = Backbone.View.extend({
    tagName: 'form',
    className: '',
    template: require('apps/admin/modules/wxNews/tpl/form.handlebars'),
    initialize: function(options) {
      this.itemIndex = options.itemIndex;
    },
    events: {},
    render: function() {
      //var model = this.model.toJSON();
      var items = this.model.get('items');
      var item = this.itemIndex >= 0 ? items[this.itemIndex] : {
        title: '',
        description: '',
        picurl: '',
        url: ''
      };
      $(this.el).html( this.template({
        item: item
      }, {helpers: require('handlebars-helper')}) );
      return this;
    },
    submit: function(options) {
      options = options || {};
      var data = $(this.el).serializeJSON();
      if(this.itemIndex >= 0) {
        //edit
        this.model.removeItem(parseInt(this.itemIndex));
      }
      this.model.addItem(data);
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});