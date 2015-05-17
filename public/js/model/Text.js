define(function(require, exports, module) {
  module.exports = Backbone.Model.extend({
    defaults: {
      content: '',
      account: '',
      keywords: []
    },
    idAttribute: 'objectId'
  });
});