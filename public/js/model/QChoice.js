define(function(require, exports, module) {
  module.exports = Backbone.Model.extend({
    defaults: {
      markdown: '',
      html: '',
      preview: '',
      groupid: '',
      items: []
    },
    idAttribute: 'objectId',
    validate: function(attrs, options) {
      if(_.isEmpty(attrs.groupid)) return '未关联题库';
      if(_.isEmpty(attrs.markdown)) return '必须输入题纲内容';
      if(_.isEmpty(attrs.html)) return '无法获取题纲内容';
      if(attrs.items.length < 2) return '必须至少包含2个选项';
      var answerItems = _.where(attrs.items, {isAnswer: 1});
      if(answerItems.length === 0) return '选项中必须包含答案';
    },
    setTopic: function(topic) {
      if(_.isString(topic)) {
        topic = {
          markdown: topic
        };
      }
      if(_.isEmpty(topic) || _.isEmpty(topic.markdown)) return;
      this.set({
        markdown: topic.markdown,
        html: (topic.html ? topic.html : topic.markdown),
        preview: (topic.preview ? topic.preview : topic.markdown)
      });
    },
    getTopic: function() {
      return {
        markdown: this.get('markdown'),
        html: this.get('html'),
        preview: this.get('html')
      };
    },
    getItem: function(index) {
      var item = this.get('items')[index];
      if(_.isEmpty(item)) {
        item = {
          markdown: '',
          html: '',
          preview: '',
          isAnswer: 0
        };
      }
      return item;
    },
    addItem: function(item) {
      if(_.isObject(item) && !_.isEmpty(item.markdown)) {
        this.set('items', _.union([{
          markdown: item.markdown,
          html: item.html ? item.html : item.markdown,
          preview: item.preview ? item.preview : item.markdown,
          isAnswer: item.isAnswer ? 1 : 0
        }], this.get('items')));
      }
    },
    removeItem: function(item) {
      var items = this.get('items');
      var _item;
      if(_.isNumber(item)) {
        _item = items[item];
      } else if(_.isString(item)) {
        _item = _.where(items, {markdown: item});
      } else if(_.isObject(item)) {
       _item = item;
      }
      if(!_.isEmpty(_item)) this.set('items', _.without(items, _item));
      return _item;
    }
  });
});