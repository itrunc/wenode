define(function(require, exports, module) {
  var dialog = require('MDialog');
  module.exports = Backbone.View.extend({
    el: '#main',
    template: '',
    Model: Backbone.Model.extend(),
    Collection: function() {
      return {collection: new Backbone.Collection.extend()};
    },
    ItemView: function(opt) {
      return (new Backbone.View.extend()(opt));
    },
    FormView: function(opt) {
      return (new Backbone.View.extend()(opt));
    },
    pageIndex: 0,
    pageSize: 10,
    isEnd: false,
    currentColumn: 0,
    columnCnt: 1,
    isLoad: true,
    rel: null,
    relAttrName: '',
    initialize: function(options) {
      this.rel = options.rel;
      this.$el.html( this.template );
      if(this.columnCnt > 1) {
        var col = '<div class="col s12 m'+parseInt(12/this.columnCnt)+'"></div>',
          list = this.$el.find('#list');
        for(var i=0; i<this.columnCnt; i++) {
          list.append(col);
        }
      }

      this.list = this.Collection().collection;
      this.listenTo(this.list, 'add', this.addOne);
      this.listenTo(this.list, 'reset', this.addAll);
      this.listenTo(this.list, 'all', this.render);

      this.fetch();
    },
    events: {
      'click .btn-create': 'onCreate',
      'click .btn-more': 'onLoad',
      'click .btn-back': 'onBack'
    },
    fetch: function(option) {
      option = option || {};
      var self = this;
      if(!this.isEnd) {
        var list = this.Collection().collection;
        list.fetch({
          data: {
            index: this.pageIndex,
            size: this.pageSize,
            rel: this.rel
          },
          success: function(results, resp, opt) {
            if(results.length < self.pageSize) {
              self.isEnd = true;
              self.$el.find('.btn-more').addClass('disabled').hide();
            }
            self.pageIndex++;
            if(results.length > 0) {
              self.list.add(results.models);
            }
            if(option.success && _.isFunction(option.success)) option.success(results, resp, opt);
          },
          error: function(obj, resp, opt) {
            dialog.toast(resp.responseText);
            if(option.error && _.isFunction(option.error)) option.error(obj, resp, opt);
          }
        });
      }
    },
    addOne: function(model) {
      var view = this.ItemView({
        model: model
      });
      if(this.columnCnt > 1) {
        if(this.isLoad) {
          this.$el.find('#list > .col').eq(this.currentColumn%this.columnCnt).append(view.render().el);
        } else {
          this.$el.find('#list > .col').eq(this.currentColumn%this.columnCnt).prepend(view.render().el);
        }
        this.currentColumn++;
      } else {
        this.$el.find('#list').append(view.render().el);
      }
      this.isLoad = true;
    },
    addAll: function() {
      this.list.each(this.addOne, this);
    },
    onCreate: function(e) {
      var self = this;
      var attrs = {};
      if(this.rel && this.relAttrName) attrs[this.relAttrName] = this.rel;
      var model = new this.Model(attrs);
      model.collection = this.list;
      var formView = this.FormView({
        model: model
      });
      require('util/BBPopup')({
        content: formView.render().el,
        buttons: [{
          label: '保存',
          action: function(e, popup) {
            formView.submit({
              success: function(obj, resp, opt) {
                self.isLoad = false;
                self.list.add(formView.model);
                popup.close();
              }
            });
          }
        }, {
          label: '取消',
          cssClass: 'btn-flat'
        }]
      }).open();
    },
    onLoad: function(e) {
      this.fetch();
    },
    onBack: function(e) {
      window.history.back();
    }
  });
});