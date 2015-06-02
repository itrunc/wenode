define(function(require, exports, module) {
  var View = require('apps/admin/view/IList').extend({
    template: require('apps/admin/modules/wxFollower/tpl/list.html'),
    Collection: require('apps/admin/modules/wxFollower/collection/followers'),
    Model: require('model/Follower'),
    ItemView: require('apps/admin/modules/wxFollower/view/item'),
    FormView: require('apps/admin/modules/wxFollower/view/form'),
    pageSize: 20
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});