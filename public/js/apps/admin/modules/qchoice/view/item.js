define(function(require, exports, module) {
  var dialog = require('MDialog');
  var FormView = require('apps/admin/modules/qchoice/view/form');
  var View = Backbone.View.extend({
    tagName: 'ul',
    className: 'collection with-header',
    template: require('apps/admin/modules/qchoice/tpl/item.handlebars'),
    initialize: function(options) {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    events: {
      'click .btn-edit': 'onEditTopic',
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
        isChanged: this.model.hasChanged('markdown') || this.model.hasChanged('items')
      }, {helpers: require('handlebars-helper')}) );
      return this;
    },
    onAddItem: function(e) {
      var that = this;
      var formView = FormView({
        model: this.model,
        idx: this.model.get('items').length
      }).show();
      return false;
    },
    onEditTopic: function(e) {
      var that = this;
      var formView = FormView({
        model: this.model
      }).show();
      return false;
    },
    onEditItem: function(e) {
      var me = $(e.target).closest('li');
      var that = this;
      var formView = FormView({
        model: this.model,
        idx: parseInt(me.data('index'))
      }).show();
      return false;
    },
    onRemoveItem: function(e) {
      var me = $(e.target).closest('li');
      this.model.removeItem(parseInt(me.data('index')));
      return false;
    },
    onDestroy: function(e) {
      var self = this;
      dialog.confirm({
        title: '删除警告',
        message: '确定删除试题吗？',
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
      return false;
    },
    onSave: function(e) {
      var that = this,
        me = $(e.target);
      me.hide();
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
      return false;
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});