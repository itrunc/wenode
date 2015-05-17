define(function(require, exports, module) {
  var moment = require('moment');
  var dialog = require('MDialog');
  var View = Backbone.View.extend({
    tagName: 'tr',
    template: require('apps/admin/modules/wxFollower/tpl/item.handlebars'),
    initialize: function(options) {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    events: {
      'click': 'onClick'
    },
    render: function() {
      var model = this.model.toJSON();
      $(this.el).html( this.template({
        model: model,
        time: moment.unix(model.time).format('YYYY-MM-DD HH:mm:ss')
      }, {helpers: require('handlebars-helper')}) );
      return this;
    },
    onClick: function(e) {
      var formView = require('apps/admin/modules/wxFollower/view/form')({
        model: this.model
      });
      dialog.show({
        title: '粉丝详细信息',
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
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});