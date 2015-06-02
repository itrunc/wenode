define(function(require, exports, module) {
  var View = require('apps/admin/view/IList').extend({
    template: require('apps/admin/tpl/IList.html'),
    Collection: require('apps/admin/modules/wxText/collection/texts'),
    Model: require('model/Text'),
    ItemView: require('apps/admin/modules/wxText/view/item'),
    FormView: require('apps/admin/modules/wxText/view/form'),
    relAttrName: 'accountid',
    columnCnt: 3
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});