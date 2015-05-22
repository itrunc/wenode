define(function(require, exports, module) {
  module.exports = Backbone.Model.extend({
    defaults: {
      markdown: '',
      html: '',
      tags: []
    },
    idAttribute: 'objectId',
    validate: function(attrs, options) {
      if(_.isEmpty(attrs.markdown)) return '必须输入文章内容';
      if(_.isEmpty(attrs.html)) return '无法获取文章内容';
    },
    toTags: function(tags) {
      var ts = tags || [];
      ts = _.isString(ts) ? ts.split(/[,\s]+/) : ts;
      ts = _.isArray(ts) ? ts : [];
      ts = _.uniq(_.without(ts, ''));
      return ts;
    },
    addTags: function(tags) {
      this.set('tags', _.union(this.toTags(tags), this.get('tags')));
    },
    removeTag: function(tag) {
      if(tag.length > 0) {
        this.set('tags', _.without(this.get('tags'), tag));
      }
    }
  });
});