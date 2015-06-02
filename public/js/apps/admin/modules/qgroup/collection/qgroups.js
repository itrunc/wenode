define(function(require, exports, module) {
  var Collection = Backbone.Collection.extend({
    model: require('model/QGroup'),
    url: '/admin/model/question_group_list'
  });

  module.exports = function() {
    return {
      collection: new Collection
    };
  };
});