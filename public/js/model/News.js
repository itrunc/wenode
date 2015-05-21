define(function(require, exports, module) {
  module.exports = Backbone.Model.extend({
    defaults: {
      items: [],
      accountid: '',
      keywords: []
    },
    idAttribute: 'objectId',
    validate: function(attrs, options) {
      if(_.isEmpty(attrs.accountid)) return '必须关联公众号';
      if(_.isEmpty(attrs.items)) return '未添加图文消息';
      if(_.isEmpty(attrs.keywords)) return '关键词不能为空';
    },
    addItem: function(item) {
      item || (item = {});
      if(_.isObject(item) && !_.isEmpty(item.title) && !_.isEmpty(item.url)) {
        this.set('items', _.sortBy(_.union([{
          title: item.title,
          description: item.description || item.title,
          picurl: item.picurl,
          url: item.url,
          seq: item.seq ? parseInt(item.seq) : 9
        }], this.get('items')), 'seq'));
      }
    },
    removeItem: function(item) {
      var items = this.get('items');
      if(_.isNumber(item)) {
        this.set('items', _.sortBy(_.without(items, items[item]), 'seq'));
      } else if(_.isString(item)) {
        this.set('items', _.sortBy(_.without(items, _.where(items, {title: item})), 'seq'));
      } else if(_.isObject(item)) {
        this.set('items', _.sortBy(_.without(items, item), 'seq'));
      }
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