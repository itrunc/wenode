var _ = require('underscore'),
	uds = require('underscore.string');
var prefix = 'wx';

var getCreateData = function(objectName, initData) {
	if(!_.isObject(initData)) return;
	var columns = [],
		data = {},
		code = 0,
		message = '',
		unique = [];
	switch(objectName) {
		case 'wxAccountList':
			columns = ['sourceid','code','name','type','intro','appid','appSecret','token','encodingAESKey','method'];
			unique = ['sourceid'];
			data = _.pick(initData, columns);
			data.token = 'wenode.avosapps.com';
			if( _.isEmpty(data.sourceid) ) {
				code = 1;
				message = '原始ID不能为空';
			}
			break;
		default:
			return;
	}
	return { code: code, message: message, data: data, unique: unique };
}; 

var getUpdateData = function(objectName, initData) {
	if(!_.isObject(initData)) return;
	var columns = [],
		data = {},
		code = 0,
		message = '';
	switch(objectName) {
		case 'wxAccountList':
			columns = ['intro','appSecret','encodingAESKey','method'];
			break;
		default:
			return;
	}
	return { code: code, message: message, data: _.pick(initData, columns) };
};

var checkLogin = function(req, res, callback) {
	if( req.AV.user ) {
		if(_.isFunction(callback)) {
			callback(req, res);
		} else {
			res.status(500).send('服务器内部错误');
		}
	}
	else {
		res.status(401).send('您还没有登录');
	}
}


var render = function(req, res) {
	res.render('main', {
		title: '管理页面',
		main: '<header id="menu"><div class="progress"><div class="indeterminate"></div></div></header><div id="main"></div>',
		appname: 'admin'
	});
};

var fetchModels = function(req, res) {
	checkLogin(req, res, function(req, res) {
		var objectName = prefix + uds.classify(req.params.model),
			index = req.query.index || 0,
			size = req.query.size || 10;
		var AVObject = AV.Object.extend(objectName);
		var query = new AV.Query(AVObject);
		query.equalTo('owner', req.AV.user);
		query.limit(size);
		query.skip(index * size);
		query.ascending('createdAt');
		query.find({
			success: function(results) {
				res.status(200).json(results);
			},
			error: function(err) {
				res.status(500).send(err.message);
			}
		});
	});
}

var createModel = function(req, res) {
	checkLogin(req, res, function(req, res) {
		var objectName = prefix + uds.classify(req.params.model),
			attrs = getCreateData(objectName, req.body);

		if(attrs.code > 0) {
			res.status(403).send(attrs.message);
			return;
		}

		var AVObject = AV.Object.extend(objectName),
			ACL = new AV.ACL(req.AV.user),
			object = new AVObject;

		ACL.setPublicReadAccess(true);

		object.setACL(ACL);
		attrs.data.owner = req.AV.user;
		object.set(attrs.data);

		if(_.isEmpty(attrs.unique)) {
			object.save(null).then(function(obj) {
				res.status(200).json(obj);
			}, function(err) {
				res.status(500).send(err.message);
			});
		} else {
			var query = new AV.Query(AVObject);
			for(var i in attrs.unique) {
				var column = attrs.unique[i];
				query.equalTo(column, attrs.data[column]);
			}
			query.count().then(function(count){
				if(count > 0) {
					res.status(403).send('违反唯一约束：' + uds.toSentence(attrs.unique));
				} else {
					object.save(null).then(function(obj) {
						res.status(200).json(obj);
					}, function(err) {
						res.status(500).send(err.message);
					});
				}
			}, function(err){
				res.status(500).send(err.message);
			});
		}
		
	});
};

var updateModel = function(req, res) {
	checkLogin(req, res, function(req, res) {
		var objectName = prefix + uds.classify(req.params.model),
			objectId = req.params.id,
			attrs = getUpdateData(objectName, req.body);

		if(attrs.code > 0) {
			res.status(403).send(attrs.message);
			return;
		}

		var AVObject = AV.Object.extend(objectName),
			object = new AVObject;
		object.id = objectId;
		object.set(attrs.data);
		object.save(null).then(function(obj) {
			res.status(200).json(obj);
		}, function(err) {
			res.status(500).send(err.message);
		});
	});
};

var destroyModel = function(req, res) {
	checkLogin(req, res, function(req, res) {
		var objectName = prefix + uds.classify(req.params.model),
			objectId = req.params.id;
		var AVObject = AV.Object.extend(objectName),
			object = new AVObject;
		object.id = objectId;
		object.destroy().then(function(obj){
			res.status(200).json(obj);
		}, function(err) {
			res.status(500).send(err.message);
		});
	});
};

module.exports = {
	render: render,
	createModel: createModel,
	fetchModels: fetchModels,
	updateModel: updateModel,
	destroyModel: destroyModel
};