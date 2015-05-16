define(function(require, exports, module) {
  module.exports = Backbone.Model.extend({
    defaults: {
      openid: '',
      sourceid: '',
      status: 0,
      time: 0,
      name: '',
      email: '',
      phone: ''
    },
    idAttribute: 'objectId'
  });
});