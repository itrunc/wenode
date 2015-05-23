define(function(require, exports, module) {
  var dialog = require('MDialog');
  var BlogModel = require('model/Blog');
  var BlogCollection = require('apps/admin/modules/blog/collection/blogs');
  var View = Backbone.View.extend({
    el: '#main',
    template: require('apps/admin/modules/blog/tpl/list.html'),
    pageIndex: 0,
    pageSize: 10,
    isEnd: false,
    initialize: function(options) {
      this.$el.html( this.template );

      this.list = BlogCollection().collection;
      this.listenTo(this.list, 'add', this.addOne);
      this.listenTo(this.list, 'reset', this.addAll);
      this.listenTo(this.list, 'all', this.render);

      this.fetch();
    },
    events: {
      'click .btn-create': 'onCreate',
      'click .btn-more': 'onLoad',
      'click .btn-back': 'onBack'
    },
    render: function() {},
    fetch: function(option) {
      option = option || {};
      var self = this;
      if(!this.isEnd) {
        var list = BlogCollection().collection;
        list.fetch({
          data: {
            index: this.pageIndex,
            size: this.pageSize
          },
          success: function(results, resp, opt) {
            if(results.length < self.pageSize) {
              self.isEnd = true;
              dialog.toast('已经全部加载');
              self.$el.find('.btn-more').addClass('disabled').hide();
            }
            self.pageIndex++;
            if(results.length > 0) {
              self.list.add(results.models);
            }
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
      var view = require('apps/admin/modules/blog/view/item')({
        model: model
      });
      this.$el.find('#list').append(view.render().el);
      this.$el.find('#list').collapsible();
    },
    addAll: function() {
      this.list.each(this.addOne, this);
    },
    onCreate: function(e) {
      var self = this;
      var blog = new BlogModel;
      blog.collection = this.list;
      var formView = require('apps/admin/modules/blog/view/form')({
        model: blog
      });
      require('util/BBPopup')({
        content: formView.render().el,
        buttons: [{
          label: '保存',
          action: function(e, popup) {
            formView.submit({
              success: function(obj, resp, opt) {
                self.list.add(formView.model);
                popup.close();
              }
            });
          }
        }, {
          label: '取消',
          cssClass: 'btn-flat'
        }]
      }).open();
    },
    onLoad: function(e) {
      this.fetch();
    },
    onBack: function(e) {
      window.history.back();
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});