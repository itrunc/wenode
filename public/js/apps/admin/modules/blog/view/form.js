define(function(require, exports, module) {
  var dialog = require('MDialog');
  var View = Backbone.View.extend({
    tagName: 'form',
    className: '',
    template: require('apps/admin/modules/blog/tpl/form.handlebars'),
    initialize: function(options) {},
    events: {},
    render: function() {
      var model = this.model.toJSON();
      $(this.el).html( this.template({
        model: model,
        tags: model.tags.join(',')
      }, {helpers: require('handlebars-helper')}) );
      this.editor = require('BBEditorMD')({
        value: this.model.get('markdown')
      });
      $(this.el).find('.input-editor').html(this.editor.el);
      return this;
    },
    submit: function(options) {
      options = options || {};
      var data = $(this.el).serializeJSON();
      this.model.set({
        title: data.title,
        tags: this.model.toTags(data.tags),
        markdown: this.editor.getContent(),
        html: this.editor.getHTML(),
        preview: this.editor.getPreview()
      });
      if(this.model.isValid()) {
        this.model.save(null, {
          success: function(obj, resp, opt) {
            if(options.success && _.isFunction(options.success)) options.success(obj,resp,opt);
            dialog.toast('保存成功');
          },
          error: function(obj, resp, opt) {
            //console.log(obj, resp, opt);
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