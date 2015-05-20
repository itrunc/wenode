define(function(require, exports, module) {
  var dialog = require('MDialog');
  var ItemFormView = require('apps/admin/modules/wxNews/view/form');
  var View = Backbone.View.extend({
    tagName: 'div',
    className: 'card grey lighten-4',
    template: require('apps/admin/modules/wxNews/tpl/item.handlebars'),
    initialize: function(options) {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    events: {
      'click .btn-remove-keyword': 'onRemoveKeyword',
      'click .btn-add-keyword': 'onAddKeyword',
      'click .btn-add-item': 'onAddItem',
      'click .btn-edit-item': 'onEditItem',
      'click .btn-remove-item': 'onRemoveItem',
      'click .btn-remove': 'onDestroy',
      'click .btn-save': 'onSave'
    },
    render: function() {
      var model = this.model.toJSON();
      $(this.el).html( this.template({
        model: model,
        isChanged: this.model.hasChanged('items') || this.model.hasChanged('keywords')
      }, {helpers: require('handlebars-helper')}) );
      return this;
    },
    onRemoveKeyword: function(e) {
      this.model.removeKeyword($(e.target).closest('.collection-item').text());
      return false;
    },
    onAddKeyword: function(e) {
      var that = this;
      dialog.prompt({
        callback: function(content) {
          if(content.length > 0) {
            that.model.addKeywords(content);
          }
        }
      });
      return false;
    },
    onAddItem: function(e) {
      var that = this;
      var formView = ItemFormView({
        model: this.model,
        itemIndex: -1
      });
      dialog.show({
        title: '添加图文消息',
        message: formView.render().el,
        withFixedFooter: false,
        buttons: [{
          label: '添加',
          action: function(modal) {
            formView.submit();
            modal.close();
          }
        }, {
          label: '取消',
          cssClass: 'btn-flat',
          action: function(modal) {
            modal.close();
          }
        }]
      });
      return false;
    },
    onEditItem: function(e) {
      var me = $(e.target).closest('.collection-item');
      var formView = ItemFormView({
        model: this.model,
        itemIndex: parseInt(me.data('index'))
      });
      dialog.show({
        title: '编辑图文消息',
        message: formView.render().el,
        withFixedFooter: false,
        buttons: [{
          label: '添加',
          action: function(modal) {
            formView.submit();
            modal.close();
          }
        }, {
          label: '取消',
          cssClass: 'btn-flat',
          action: function(modal) {
            modal.close();
          }
        }]
      });
      return false;
    },
    onRemoveItem: function(e) {
      var me = $(e.target).closest('.collection-item');
      this.model.removeItem(parseInt(me.data('index')));
      return false;
    },
    onDestroy: function(e) {
      var self = this;
      dialog.confirm({
        title: '删除警告',
        message: '确定删除图文消息吗？',
        btnOKClass: 'btn-flat',
        btnOKLabel: '是',
        btnCancelLabel: '否',
        callback: function(confirm) {
          if(confirm) {
            self.model.destroy({
              success: function(model, resp, options) {
                dialog.toast('删除成功');
              },
              error: function(model, resp, options) {
                dialog.toast(resp.responseText);
              },
              wait: true
            });
          }
        }
      });
    },
    onSave: function(e) {
      var that = this,
        me = $(e.target);
      me.hide();
      if(this.model.hasChanged('items') || this.model.hasChanged('keywords')) {
        if(this.model.isValid()) {
          this.model.save(null, {
            success: function(obj, resp, opt) {
              dialog.toast('保存成功');
            },
            error: function(obj, resp, opt) {
              dialog.toast(resp.responseText);
              me.show();
            }
          });
        } else {
          dialog.toast(this.model.validationError);
          me.show();
        }
      } else {
        dialog.toast('当前图文消息未有改动');
      }
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});