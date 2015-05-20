define(function(require, exports, module) {
  var Collection = Backbone.Collection.extend({
    model: require('model/News'),
    url: '/admin/model/news_list'
  });

  module.exports = function() {
    return {
      collection: new Collection
    };
  };
});