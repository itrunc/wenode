define(function(require, exports, module) {
  var dialog = require('MDialog');
  var NewsModel = require('model/News');
  var NewsCollection = require('apps/admin/modules/wxNews/collection/News');
  var View = Backbone.View.extend({
    el: '#main',
    template: require('apps/admin/modules/wxNews/tpl/list.html'),
    pageIndex: 0,
    pageSize: 10,
    isEnd: false,
    currentColumn: 0,
    columnCnt: 3,
    isLoad: true,
    initialize: function(options) {
      this.account = options.account;
      this.$el.html( this.template );
      var col = '<div class="col s12 m'+parseInt(12/this.columnCnt)+'"></div>',
          list = this.$el.find('#list');
      for(var i=0; i<this.columnCnt; i++) {
        list.append(col);
      }
      this.list = NewsCollection().collection;
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
        var list = NewsCollection().collection;
        list.fetch({
          data: {
            index: this.pageIndex,
            size: this.pageSize,
            rel: this.account
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
      var view = require('apps/admin/modules/wxNews/view/item')({
        model: model
      });
      if(this.isLoad) {
        this.$el.find('#list > .col').eq(this.currentColumn%this.columnCnt).append(view.render().el);
      } else {
        this.$el.find('#list > .col').eq(this.currentColumn%this.columnCnt).prepend(view.render().el);
      }
      this.isLoad = true;
      this.currentColumn++;
    },
    addAll: function() {
      this.list.each(this.addOne, this);
    },
    onCreate: function(e) {
      var that = this;
      var news = new NewsModel({
        accountid: this.account
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