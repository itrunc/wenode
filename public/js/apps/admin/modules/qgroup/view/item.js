define(function(require, exports, module) {
  var dialog = require('MDialog');
  var View = Backbone.View.extend({
    tagName: 'div',
    className: 'card',
    template: require('apps/admin/modules/qgroup/tpl/item.handlebars'),
    initialize: function(options) {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    events: {
      'click .btn-edit': 'onEdit',
      'click .btn-remove': 'onRemove'
    },
    render: function() {
      var model = this.model.toJSON();
      $(this.el).html( this.template({
        model: model
      }, {helpers: require('handlebars-helper')}) );
      return this;
    },
    onEdit: function(e) {
      var formView = require('apps/admin/modules/qgroup/view/form')({
        model: this.model
      });
      dialog.show({
        title: '编辑题库',
        message: formView.render().el,
        withFixedFooter: false,
        buttons: [{
          label: '保存',
          action: function(modal) {
            formView.submit({
              success: function(obj,resp,opt) {
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
      return false;
    },
    onRemove: function(e) {
      var self = this;
      dialog.confirm({
        title: '删除警告',
        message: '您将删除题库：'+this.model.getTitle()+'?',
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
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});