define(function(require, exports, module) {
  var View = require('apps/admin/view/IList').extend({
    template: require('apps/admin/tpl/IList.html'),
    Collection: require('apps/admin/modules/qchoice/collection/qchoices'),
    Model: require('model/QChoice'),
    ItemView: require('apps/admin/modules/qchoice/view/item'),
    FormView: require('apps/admin/modules/qchoice/view/form'),
    relAttrName: 'groupid'
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});