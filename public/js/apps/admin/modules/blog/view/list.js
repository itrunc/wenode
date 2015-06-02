define(function(require, exports, module) {
  var View = require('apps/admin/view/IList').extend({
    template: require('apps/admin/modules/blog/tpl/list.html'),
    Collection: require('apps/admin/modules/blog/collection/blogs'),
    Model: require('model/Blog'),
    ItemView: require('apps/admin/modules/blog/view/item'),
    FormView: require('apps/admin/modules/blog/view/form'),
    addOne: function(model) {
      var view = this.ItemView({
        model: model
      });
      this.$el.find('#list').append(view.render().el);
      this.$el.find('#list').collapsible();
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});