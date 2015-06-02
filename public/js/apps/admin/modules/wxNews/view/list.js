define(function(require, exports, module) {
  var dialog = require('MDialog');
  var View = require('apps/admin/view/IList').extend({
    template: require('apps/admin/tpl/IList.html'),
    Collection: require('apps/admin/modules/wxNews/collection/News'),
    Model: require('model/News'),
    ItemView: require('apps/admin/modules/wxNews/view/item'),
    FormView: require('apps/admin/modules/wxNews/view/form'),
    columnCnt: 3,
    onCreate: function(e) {
      var that = this;
      var news = new this.Model({
        accountid: this.rel
      });
      dialog.prompt({
        title: '请输入关键字(逗号分割)',
        callback: function(content) {
          if(content.length > 0) {
            news.addKeywords(content);
            that.isLoad = false;
            that.list.add(news);
          }
        }
      });
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});