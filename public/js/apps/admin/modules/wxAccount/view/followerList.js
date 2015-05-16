define(function(require, exports, module) {
  var dialog = require('MDialog'),
      FollowerModel = require('model/Follower');

  var View = Backbone.View.extend({
    el: '#main',
    template: require('apps/admin/modules/wxAccount/tpl/followerList.html'),
    pageIndex: 0,
    pageSize: 20,
    isEnd: false,
    initialize: function(options) {
      this.account = options.account;

      this.$el.html( this.template );

      this.list = require('apps/admin/modules/wxAccount/collection/FollowerCollection')().collection;
      this.listenTo(this.list, 'add', this.addOne);
      this.listenTo(this.list, 'reset', this.addAll);
      this.listenTo(this.list, 'all', this.render);

      this.fetch();
    },
    events: {
      'click #btn-more': 'onLoad',
      'click .btn-back': 'onBack'
    },
    fetch: function(option) {
      option = option || {};
      var self = this;
      if(!this.isEnd) {
        this.list.fetch({
          data: {
            index: this.pageIndex,
            size: this.pageSize,
            rel: this.account
          },
          success: function(results, resp, opt) {
            if(results.length < self.pageSize) {
              self.isEnd = true;
              dialog.toast('已经全部加载');
              self.$el.find('#btn-more').addClass('disabled').hide();
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
      var view = require('apps/admin/modules/wxAccount/view/followerItem')({
        model: model
      });
      this.$el.find('#list').append(view.render().el);
    },
    addAll: function() {
      this.list.each(this.addOne, this);
    },
    render: function() {},
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