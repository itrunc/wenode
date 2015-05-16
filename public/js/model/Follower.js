define(function(require, exports, module) {
  module.exports = Backbone.Model.extend({
    defaults: {
      openid: 'ooooooo',
      sourceid: 'ssssssss',
      status: 0,
      time: 0
    },
    idAttribute: 'objectId'
  });
});