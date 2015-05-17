define(function(require, exports, module) {
  var dialog = require('MDialog'),
      moment = require('moment');
  var View = Backbone.View.extend({
    tagName: 'form',
    template: require('apps/admin/modules/wxFollower/tpl/form.handlebars'),
    initialize: function(options) {},
    events: {},
    render: function() {
      var model = this.model.toJSON();
      $(this.el).html(this.template({
        model: model,
        time: moment.unix(model.time).format('YYYY-MM-DD HH:mm:ss')
      }, {helpers: require('handlebars-helper')}));
      return this;
    },
    submit: function(options) {
      options = options || {};
      var data = $(this.el).serializeJSON();
      this.model.set(data);
      if(this.model.isValid()) {
        this.model.save(null, {
          success: function(obj, resp, opt) {
            if(options.success && _.isFunction(options.success)) options.success(obj,resp,opt);
            dialog.toast('保存成功');
          },
          error: function(obj, resp, opt) {
            dialog.toast(resp.responseText);
          }
        });
      } else {
        dialog.toast(this.model.validationError);
      }
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});