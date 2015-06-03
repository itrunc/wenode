define(function(require, exports, module) {
  var Collection = Backbone.Collection.extend({
    model: require('model/QChoice'),
    url: '/admin/model/question_choice'
  });

  module.exports = function() {
    return {
      collection: new Collection
    };
  };
});