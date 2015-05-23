define(function(require, exports, module) {
  var ButtonView = Backbone.View.extend({
    tagName: 'a',
    className: 'waves-effect waves-green',
    initialize: function(options) {
      options || (options={});
      var defaults = {
        label:  'Button',
        action: function(e, container) {
          if(container && _.isFunction(container.close)) container.close();
        },
        cssClass: 'btn'
      };
      this.options = _.extend({}, defaults, options);
      $(this.el).addClass(this.options.cssClass).text(this.options.label);
    },
    events: {
      'click': 'onClick'
    },
    render: function() {
      return this;
    },
    onClick: function(e) {
      this.options.action.call(this, e, this.options.container);
    }
  });

  var View = Backbone.View.extend({
    tagName: 'div',
    className: 'wn-popup grey lighten-5',
    tagId: _.uniqueId('bb-popup-'),
    template: '<div class="wn-popup-container"></div>',
    buttons: [],
    initialize: function(options) {
      var defaults = {
        onOpen: function() {},
        onClose: function() {},
        content: '',
        buttons: []
      };
      options || (options={});
      this.options = _.extend({}, defaults, options);
      $(this.el).html(this.template).attr('id', this.tagId).find('.wn-popup-container').html(this.options.content);
      if(this.options.buttons.length > 0) {
        var footer = $('<div class="wn-popup-footer right-align"></div>');
        for(var i in this.options.buttons) {
          var buttonOpt = this.options.buttons[i];
          buttonOpt.container = this;
          var button = new ButtonView(buttonOpt);
          footer.append(button.el);
          this.buttons.push(button);
        }
        $(this.el).append(footer);
      }
    },
    events: {},
    render: function() {
      var that = this;
      $(this.el).appendTo('body').fadeIn('slow', function(){
        that.options.onOpen(that);
      });
      return this;
    },
    open: function() {
      this.render();
    },
    close: function() {
      var that = this;
      $(this.el).appendTo('body').fadeOut('slow', function() {
        that.options.onClose(that);
        if(that.buttons.length > 0) {
          _.each(that.buttons, function(button) {
            button.remove();
          });
        }
        that.remove();
      });
    }
  });

  module.exports = function(options) {
    return ( new View(options) );
  }
});