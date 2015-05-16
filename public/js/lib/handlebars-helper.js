define(function(require, exports, module) {
	module.exports = {
		eq: function(v1,v2,options) {
			if(v1==v2) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		gt: function(v1,v2,options) {
			if(v1>v2) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
    empty: function(context, options) {
      context = context || '';
      var isEmpty = context.length===0 ? true : false; //不严谨
      if(isEmpty) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
	}
});