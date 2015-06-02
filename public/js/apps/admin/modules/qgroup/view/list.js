define(function(require, exports, module) {
  var View = require('apps/admin/view/IList').extend({
    template: require('apps/admin/tpl/IList.html'),
    Collection: require('apps/admin/modules/qgroup/collection/qgroups'),
    Model: require('model/QGroup'),
    ItemView: require('apps/admin/modules/qgroup/view/item'),
    FormView: require('apps/admin/modules/qgroup/view/form'),
    columnCnt: 3
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});