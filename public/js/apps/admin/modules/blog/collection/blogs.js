define(function(require, exports, module) {
  var Collection = Backbone.Collection.extend({
    model: require('model/Blog'),
    url: '/admin/model/blog_list'
  });

  module.exports = function() {
    return {
      collection: new Collection
    };
  };
});