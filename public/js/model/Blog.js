define(function(require, exports, module) {
  module.exports = require('model/IModelWithTags').extend({
    defaults: {
      title: '',
      content: '',
      tags: []
    },
    validate: function(attrs, options) {
      if(_.isEmpty(attrs.title)) return '必须输入文章标题';
      if(_.isEmpty(attrs.content)) return '必须输入文章内容';
    }
  });
});