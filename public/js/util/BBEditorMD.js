define(function(require, exports, module) {
  var View = Backbone.View.extend({
    tagName: 'div',
    className: '',
    tagId: _.uniqueId('EditorMD'),
    initialize: function(options) {
      options || (options={});
      var defaults = {
        $el: $(this.el)
      };
      options.path || (defaults.path='/js/lib/editor.md/lib/');
      options.pluginPath || (defaults.pluginPath='/js/lib/editor.md/plugins/');
      options.height || (defaults.height=388);
      options.saveHTMLToTextarea || (defaults.saveHTMLToTextarea=true);
      $(this.el).attr('id', this.tagId);
      this.editor = require('editor')(_.extend({}, options, defaults));
    },
    events: {},
    render: function() {
      return this;
    },
    getHTML: function() {
      return this.editor.getHTML();
    },
    getContent: function() {
      return this.editor.getValue();
    },
    setContent: function(content) {
      return this.editor.setValue(content);
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});