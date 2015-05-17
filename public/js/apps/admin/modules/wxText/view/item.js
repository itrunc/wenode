define(function(require, exports, module) {
  var dialog = require('MDialog');
  var View = Backbone.View.extend({
    tagName: 'ul',
    className: 'collection with-header',
    template: require('apps/admin/modules/wxText/tpl/item.handlebars'),
    initialize: function(options) {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    events: {
      'click .btn-remove-keyword': 'onRemoveKeyword',
      'click .btn-add-keyword': 'onAddKeyword',
      'click .btn-edit-content': 'onEditContent',
      'click .btn-remove': 'onDestroy',
      'click .btn-save': 'onSave'
    },
    render: function() {
      var model = this.model.toJSON();
      $(this.el).html( this.template({
        model: model
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
    onEditContent: function(e) {
      var that = this;
      dialog.prompt({
        message: this.model.get('content'),
        callback: function(content) {
          that.model.set('content', content);
        }
      });
      return false;
    },
    onDestroy: function(e) {
      var self = this;
      dialog.confirm({
        title: '删除警告',
        message: '确定删除文本消息吗？',
        btnOKClass: 'btn-flat',
        btnOKLabel: '是',
        //btnCancelClass: 'blue',
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
      if(this.model.hasChanged()) {
        if(this.model.isValid()) {
          this.model.save(null, {
            success: function(obj, resp, opt) {
              dialog.toast('保存成功');
            },
            error: function(obj, resp, opt) {
              dialog.toast(resp.responseText);
            }
          });
        } else {
          dialog.toast(this.model.validationError);
        }
      } else {
        dialog.toast('当前文本消息未有改动');
      }
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});