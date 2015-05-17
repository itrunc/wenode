define(function(require, exports, module) {
  var Collection = Backbone.Collection.extend({
    model: require('model/Text'),
    url: '/admin/model/text_list'
  });

  module.exports = function() {
    return {
      collection: new Collection
    };
  };
});