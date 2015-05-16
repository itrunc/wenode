var _ = require('underscore'),
	uds = require('underscore.string');
var prefix = 'wx';

function shouldLogin(req, res, next) {
  if(req.AV.user) {
    next();
  } else if(req.route.method == 'get' && req.route.path == '/admin') {
    res.redirect('/user#signin');
  } else {
    res.status(401).send('您还没有登录！');
  }
}

function filterData(req, res, next) {
  var data = {
    objectName: prefix + uds.classify(req.params.model),
    objectId: req.params.id,
    body: req.body,
    unique: []
  };
  var columns = [];
  switch(req.route.method) {
    case 'get':
      data.body = {
        index: req.query.index || 0,
        size: req.query.size || 10
      };
      break;
    case 'post':
      switch(data.objectName) {
        case 'wxAccountList':
          columns = ['sourceid','code','name','type','intro','appid','appSecret','token','encodingAESKey','method'];
          data.unique = ['sourceid'];
          data.body = _.pick(data.body, columns);
          data.body.token = 'wenode.avosapps.com';
          if( _.isEmpty(data.body.sourceid) ) {
            res.status(400).send('原始ID不能为空');
            return;
          }
          break;
        default:
          res.status(400).send('您访问的模型不存在');
          return;
      }
      break;
    case 'put':
      switch(data.objectName) {
        case 'wxAccountList':
          columns = ['intro','appSecret','encodingAESKey','method'];
          data.body = _.pick(data.body, columns);
          break;
        default:
          res.status(400).send('您访问的模型不存在');
          return;
      }
      break;
    case 'delete':
      break;
    default:
      break;
  }
  req.wenode_data = data;
  next();
}

function render(req, res) {
	res.render('main', {
		title: '管理页面',
		main: '<header id="menu"><div class="progress"><div class="indeterminate"></div></div></header><div id="main"></div>',
		appname: 'admin'
	});
}

function fetchModels(req, res) {
  var data = req.wenode_data;
  var AVObject = AV.Object.extend(data.objectName);
  var query = new AV.Query(AVObject);
  query.equalTo('owner', req.AV.user);
  query.limit(data.body.size);
  query.skip(data.body.index * data.body.size);
  query.ascending('createdAt');
  query.find({
    success: function(results) {
      res.status(200).json(results);
    },
    error: function(err) {
      res.status(500).send(err.message);
    }
  });
}

function createModel(req, res) {
  var data = req.wenode_data;

  var AVObject = AV.Object.extend(data.body.objectName),
    ACL = new AV.ACL(req.AV.user),
    object = new AVObject;

  ACL.setPublicReadAccess(true);

  object.setACL(ACL);
  data.body.owner = req.AV.user;
  object.set(data.body);

  if(_.isEmpty(data.unique)) {
    object.save(null).then(function(obj) {
      res.status(200).json(obj);
    }, function(err) {
      res.status(500).send(err.message);
    });
  } else {
    var query = new AV.Query(AVObject);
    for(var i in data.unique) {
      var column = data.unique[i];
      query.equalTo(column, data.body[column]);
    }
    query.count().then(function(count){
      if(count > 0) {
        res.status(403).send('违反唯一约束：' + uds.toSentence(data.unique));
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
}

function updateModel(req, res) {
  var data = req.wenode_data;

  var AVObject = AV.Object.extend(data.objectName),
    object = new AVObject;
  object.id = data.objectId;
  object.set(data.body);
  object.save(null).then(function(obj) {
    res.status(200).json(obj);
  }, function(err) {
    res.status(500).send(err.message);
  });
}

function destroyModel(req, res) {
  var data = req.wenode_data;
  var AVObject = AV.Object.extend(data.objectName),
    object = new AVObject;
  object.id = data.objectId;
  object.destroy().then(function(obj){
    res.status(200).json(obj);
  }, function(err) {
    res.status(500).send(err.message);
  });
}

module.exports = {
	render: render,
  shouldLogin: shouldLogin,
  filterData: filterData,
	createModel: createModel,
	fetchModels: fetchModels,
	updateModel: updateModel,
	destroyModel: destroyModel
};