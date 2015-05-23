define(function(require, exports, module) {
  var dialog = require('MDialog');
  var moment = require('moment');
  var View = Backbone.View.extend({
    tagName: 'li',
    className: '',
    template: require('apps/admin/modules/blog/tpl/item.handlebars'),
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
        model: model,
        //updatedAt: moment(model.updatedAt).format('YYYY年MM月DD日')
        updatedAt: moment(model.updatedAt).fromNow()
      }, {helpers: require('handlebars-helper')}) );
      $(this.el).closest('#list').collapsible();
      return this;
    },
    onEdit: function(e) {
      var formView = require('apps/admin/modules/blog/view/form')({
        model: this.model
      });
      require('util/BBPopup')({
        content: formView.render().el,
        buttons: [{
          label: '保存',
          action: function(e, popup) {
            formView.submit({
              success: function(obj, resp, opt) {
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
    onRemove: function(e) {
      var self = this;
      dialog.confirm({
        title: '删除警告',
        message: '您将删除文章：'+this.model.get('title')+'?',
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
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});