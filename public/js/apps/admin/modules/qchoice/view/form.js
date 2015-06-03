define(function(require, exports, module) {
  var View = Backbone.View.extend({
    tagName: 'form',
    className: '',
    template: require('apps/admin/modules/qchoice/tpl/form.handlebars'),
    initialize: function(options) {
      this.idx = parseInt(options.idx);
    },
    events: {},
    render: function() {
      var content;
      var data = {
        isItem: false
      };
      if(this.idx >= 0) {
        data.isItem = true;
        content = this.model.getItem(this.idx);
        data.isAnswer = (content.isAnswer > 0);
      } else {
        content = this.model.getTopic();
      }
      $(this.el).html( this.template(data, {helpers: require('handlebars-helper')}) );
      this.editor = require('BBEditorMD')({
        value: content.markdown
      });
      $(this.el).find('.input-editor').html(this.editor.el);
      return this;
    },
    show: function(options) {
      var that = this;
      require('util/BBPopup')({
        content: this.render().el,
        buttons: [{
          label: '保存',
          action: function(e, popup) {
            that.submit(options);
            popup.close();
          }
        }, {
          label: '取消',
          cssClass: 'btn-flat'
        }]
      }).open();
      return this;
    },
    submit: function(options) {
      options = options || {};
      var content = {
        markdown: this.editor.getContent(),
        html: this.editor.getHTML(),
        preview: this.editor.getPreview()
      };
      if(this.idx >= 0) {
        var data = $(this.el).serializeJSON();
        content.isAnswer = (data.isAnswer ? 1 : 0);
        var oldItem = this.model.removeItem(this.idx);
        if(_.isEmpty(content.html) && !_.isEmpty(content.markdown) && oldItem) {
          oldItem.isAnswer = content.isAnswer;
          this.model.addItem(oldItem);
        } else {
          this.model.addItem(content);
        }
      } else {
        if(_.isEmpty(content.html) && !_.isEmpty(content.markdown)) return;
        this.model.setTopic(content);
      }
      if(options.success && _.isFunction(options.success)) options.success();
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});