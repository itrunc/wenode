define(function(require, exports, module) {
  module.exports = require('model/IModelWithTags').extend({
    defaults: {
      title: '',
      detail: '',
      tags: []
    },
    validate: function(attrs, options) {
      if(_.isEmpty(attrs.title)) return '必须输入题库名称';
    },
    getTitle: function() {
      return this.get('title');
    }
  });
});