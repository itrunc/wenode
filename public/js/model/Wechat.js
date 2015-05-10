define(function(require, exports, module) {

	module.exports = Backbone.Model.extend({
		defaults: {
			sourceId: '',
			code: '',
			name: '',
			type: '',
			info: '',
			appId: '',
			appSecret: '',
			token: '',
			encodingAESKey: '',
			method: ''
		},
		WechatType: {
			SUBSCRIBE: 'DY',
			SERVE: 'FW'
		},
		EncryptMethod: {
			UNENCRYPTED: 'MW',
			COMPATIBLE: 'JR',
			ENCRYPTED: 'AQ'
		},
		idAttribute: 'objectId',
		initialize: function() {},
		validate: function(attrs, options) {
			if(attrs.sourceId.length==0) return 'Not Allowed empty Source Id';
			if(attrs.code.length==0) return 'Not Allowed empty Account code';
			if(attrs.name.length==0) return 'Not Allowed empty Account name';
			if(attrs.appId.length==0) return 'Not Allowed empty AppId';
			if(attrs.token.length==0) return 'Not Allowed empty Token';
			if( _.indexOf(_.values(this.WechatType), attrs.type) < 0 ) return 'Not Allowed Type';
			if( _.indexOf(_.values(this.EncryptMethod), attrs.method) < 0) return 'Not Allowed Method';
		}
	});
});