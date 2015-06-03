define(function(require, exports, module) {
  module.exports = Backbone.Model.extend({
    defaults: {
      topic: '',
      groupid: '',
      items: []
    },
    idAttribute: 'objectId',
    validate: function(attrs, options) {
      if(_.isEmpty(attrs.groupid)) return '未关联题库';
      if(_.isEmpty(attrs.topic)) return '必须输入题纲内容';
      if(attrs.items.length < 2) return '必须至少包含2个选项';
      var answerItems = _.where(attrs.items, {isAnswer: 1});
      if(answerItems.length === 0) return '选项中必须包含答案';
    },
    setTopic: function(topic) {
      var content;
      if(_.isObject(topic)) {
        content = topic.topic;
      } else {
        content = topic.toString();
      }
      this.set('topic', content);
    },
    getTopic: function() {
      return {
        topic: this.get('topic')
      };
    },
    getItem: function(index) {
      var item = this.get('items')[index];
      if(_.isEmpty(item)) {
        item = {
          topic: '',
          isAnswer: 0
        };
      }
      return item;
    },
    addItem: function(item) {
      if(_.isObject(item) && !_.isEmpty(item.topic)) {
        this.set('items', _.union([{
          topic: item.topic,
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
        _item = _.where(items, {topic: item});
      } else if(_.isObject(item)) {
       _item = item;
      }
      if(!_.isEmpty(_item)) this.set('items', _.without(items, _item));
      return _item;
    }
  });
});