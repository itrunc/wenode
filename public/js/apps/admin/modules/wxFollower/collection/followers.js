define(function(require, exports, module) {
  var Collection = Backbone.Collection.extend({
    model: require('model/Follower'),
    url: '/admin/model/follower_list'
  });

  module.exports = function() {
    return {
      collection: new Collection
    };
  };
});