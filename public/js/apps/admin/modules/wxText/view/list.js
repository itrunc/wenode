define(function(require, exports, module) {
  var dialog = require('MDialog');
  var TextModel = require('model/Text');
  var View = Backbone.View.extend({
    el: '#main',
    template: require('apps/admin/modules/wxText/tpl/list.html'),
    pageIndex: 0,
    pageSize: 5,
    isEnd: false,
    initialize: function(options) {
      this.$el.html( this.template );

      this.list = require('apps/admin/modules/wxText/collection/TextCollection')().collection;
      this.listenTo(this.list, 'add', this.addOne);
      this.listenTo(this.list, 'reset', this.addAll);
      this.listenTo(this.list, 'all', this.render);

      this.fetch();
    },
    events: {
      'click .btn-create': 'onCreate',
      'click .btn-more': 'onLoad'
    },
    render: function() {},
    fetch: function(option) {
      option = option || {};
      var self = this;
      if(!this.isEnd) {
        this.list.fetch({
          data: {
            index: this.pageIndex,
            size: this.pageSize
          },
          success: function(results, resp, opt) {
            if(results.length < self.pageSize) {
              self.isEnd = true;
              dialog.toast('已经全部加载');
              self.$el.find('#btn-more').addClass('disabled');
            }
            self.pageIndex++;
            if(option.success && _.isFunction(option.success)) option.success(results, resp, opt);
          },
          error: function(obj, resp, opt) {
            dialog.toast(resp.responseText);
            if(option.error && _.isFunction(option.error)) option.error(obj, resp, opt);
          }
        });
      }
    },
    addOne: function(model) {
      var view = require('apps/admin/modules/wxText/view/item')({
        model: model
      });
      this.$el.find('#list').append(view.render().el);
    },
    addAll: function() {
      this.list.each(this.addOne, this);
    },
    onCreate: function(e) {
      var self = this;
      var text = new TextModel;
      text.collection = this.list;
      var formView = require('apps/admin/modules/wxText/view/form')({
        model: text
      });
      dialog.show({
        title: '添加文本消息',
        message: formView.render().el,
        withFixedFooter: false,
        buttons: [{
          label: '保存',
          action: function(modal) {
            formView.submit({
              success: function(obj,resp,opt) {
                self.list.add(formView.model);
                modal.close();
              }
            });
          }
        }, {
          label: '取消',
          cssClass: 'btn-flat',
          action: function(modal) {
            modal.close();
          }
        }]
      });
    },
    onLoad: function(e) {
      this.fetch();
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});