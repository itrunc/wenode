define(function(require, exports, module) {
  var dialog = require('MDialog');
  var QGroupModel = require('model/QGroup');
  var QGroupCollection = require('apps/admin/modules/qgroup/collection/qgroups');
  var View = Backbone.View.extend({
    el: '#main',
    template: require('apps/admin/modules/qgroup/tpl/list.html'),
    pageIndex: 0,
    pageSize: 10,
    isEnd: false,
    currentColumn: 0,
    columnCnt: 3,
    isLoad: true,
    initialize: function(options) {
      this.$el.html( this.template );
      var col = '<div class="col s12 m'+parseInt(12/this.columnCnt)+'"></div>',
          list = this.$el.find('#list');
      for(var i=0; i<this.columnCnt; i++) {
        list.append(col);
      }

      this.list = QGroupCollection().collection;
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
        var list = QGroupCollection().collection;
        list.fetch({
          data: {
            index: this.pageIndex,
            size: this.pageSize
          },
          success: function(results, resp, opt) {
            if(results.length < self.pageSize) {
              self.isEnd = true;
              //dialog.toast('已经全部加载');
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
      var view = require('apps/admin/modules/qgroup/view/item')({
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
      var self = this;
      var qgroup = new QGroupModel;
      qgroup.collection = this.list;
      var formView = require('apps/admin/modules/qgroup/view/form')({
        model: qgroup
      });
      dialog.show({
        title: '添加题库',
        message: formView.render().el,
        withFixedFooter: false,
        buttons: [{
          label: '保存',
          action: function(modal) {
            formView.submit({
              success: function(obj,resp,opt) {
                self.isLoad = false;
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
    },
    onBack: function(e) {
      window.history.back();
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});