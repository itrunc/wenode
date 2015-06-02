define(function(require, exports, module) {
  module.exports = require('model/IModelWithTags').extend({
    defaults: {
      title: '',
      markdown: '',
      html: '',
      preview: '',
      tags: []
    },
    validate: function(attrs, options) {
      if(_.isEmpty(attrs.title)) return '必须输入文章标题';
      if(_.isEmpty(attrs.markdown)) return '必须输入文章内容';
      if(_.isEmpty(attrs.html)) return '无法获取文章内容';
    }
  });
});