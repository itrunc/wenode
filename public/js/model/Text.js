define(function(require, exports, module) {
  module.exports = Backbone.Model.extend({
    defaults: {
      content: '',
      accountid: '',
      keywords: []
    },
    idAttribute: 'objectId',
    validate: function(attrs, options) {
      if(_.isEmpty(attrs.accountid)) return '必须关联公众号';
      if(_.isEmpty(attrs.content)) return '消息内容不能为空';
      if(_.isEmpty(attrs.keywords)) return '关键词不能为空';
    },
    toKeywords: function(keywords) {
      var kws = keywords || [];
      kws = _.isString(kws) ? kws.split(/[,\s]+/) : kws;
      kws = _.isArray(kws) ? kws : [];
      kws = _.uniq(_.without(kws, ''));
      return kws;
    },
    addKeywords: function(keywords) {
      this.set('keywords', _.union(this.toKeywords(keywords), this.get('keywords')));
    },
    removeKeyword: function(keyword) {
      if(keyword.length > 0) {
        this.set('keywords', _.without(this.get('keywords'), keyword));
      }
    }
  });
});