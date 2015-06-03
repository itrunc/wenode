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

function toKeyword(keywords) {
  var kws = keywords || [];
  if(_.isString(kws)) kws = kws.split(/[,\s]+/);
  if(kws.length <= 0) {
    kws = [];
  } else {
    kws = _.uniq(_.without(kws, ''));
  }
  return kws;
}

var ModelList = [{
  name: 'wxAccountList',
  get: {
    columns: ['sourceid','code','name','type','intro','appid','appSecret','token','encodingAESKey','method']
  },
  post: {
    columns: ['sourceid','code','name','type','intro','appid','appSecret','token','encodingAESKey','method'],
    unique: ['sourceid'],
    fixed: [{
      key: 'token',
      value: 'wenode.avosapps.com'
    }],
    check: [{
      key: 'sourceid',
      message: '原始ID不能为空'
    }]
  },
  put: {
    columns: ['intro','appSecret','encodingAESKey','method']
  }
}, {
  name: 'wxFollowerList',
  rel: {
    name: 'wxAccountList',
    column: 'account',
    id: 'accountid'
  },
  get: {
    columns: ['sourceid','email','phone','name','time','openid','status']
  },
  put: {
    columns: ['name','email','phone']
  }
}, {
  name: 'wxTextList',
  rel: {
    name: 'wxAccountList',
    column: 'account',
    id: 'accountid'
  },
  get: {
    columns: ['accountid','content','keywords'],
  },
  post: {
    columns: ['accountid','content','keywords'],
    check: [{
      key: 'accountid',
      message: '必须关联公众号'
    },{
      key: 'content',
      message: '消息内容不能为空'
    }],
    convert: [{
      key: 'keywords',
      func: toKeyword
    }]
  },
  put: {
    columns: ['content','keywords'],
    check: [{
      key: 'content',
      message: '消息内容不能为空'
    }],
    convert: [{
      key: 'keywords',
      func: toKeyword
    }]
  }
}, {
  name: 'wxNewsList',
  rel: {
    name: 'wxAccountList',
    column: 'account',
    id: 'accountid'
  },
  get: {
    columns: ['accountid','items','keywords']
  },
  post: {
    columns: ['accountid','items','keywords'],
    check: [{
      key: 'accountid',
      message: '必须关联公众号'
    },{
      key: 'items',
      message: '图文消息不能为空'
    },{
      key: 'items',
      message: '图文消息格式不对',
      func: _.isArray,
      reverse: true
    }],
    convert: [{
      key: 'keywords',
      func: toKeyword
    }]
  },
  put: {
    columns: ['items','keywords'],
    check: [{
      key: 'items',
      message: '图文消息不能为空'
    },{
      key: 'items',
      message: '图文消息格式不对',
      func: _.isArray,
      reverse: true
    }],
    convert: [{
      key: 'keywords',
      func: toKeyword
    }]
  }
}, {
  name: 'wxBlogList',
  get: {
    columns: ['title','content','tags']
  },
  post: {
    columns: ['title','content','tags'],
    convert: [{
      key: 'tags',
      func: toKeyword
    }]
  },
  put: {
    columns: ['title','content','tags'],
    convert: [{
      key: 'tags',
      func: toKeyword
    }]
  }
}, {
  name: 'wxQuestionGroupList',
  get: {
    columns: ['title','detail','tags']
  },
  post: {
    columns: ['title','detail','tags'],
    convert: [{
      key: 'tags',
      func: toKeyword
    }]
  },
  put: {
    columns: ['title','detail','tags'],
    convert: [{
      key: 'tags',
      func: toKeyword
    }]
  }
}, {
  name: 'wxQuestionChoice',
  rel: {
    name: 'wxQuestionGroupList',
    column: 'group',
    id: 'groupid'
  },
  get: {
    columns: ['groupid','topic','items']
  },
  post: {
    columns: ['groupid','topic','items'],
    check: [{
      key: 'groupid',
      message: '必须关联题库'
    }, {
      key: 'topic',
      message: '题纲内容不能为空'
    }, {
      key: 'items',
      message: '选项不能为空'
    }]
  },
  put: {
    columns: ['topic','items'],
    check: [{
      key: 'topic',
      message: '题纲内容不能为空'
    }, {
      key: 'items',
      message: '选项不能为空'
    }]
  }
}];

function filterData(req, res, next) {
  var data = {
    objectName: prefix + uds.classify(req.params.model),
    objectId: req.params.id,
    body: req.body,
    unique: []
  };
  var RelObject, chkItem;
  var model = _.where(ModelList, {name: data.objectName});
  switch(req.route.method) {
    case 'get':
      data.body = {
        index: req.query.index || 0,
        size: req.query.size || 10,
        rel: {},
        columns: []
      };
      if(model.length > 0) {
        model = model[0];
        if(model.get.columns.length > 0) data.body.columns = model.get.columns;
        if(_.has(model, 'rel')) {
          data.body.rel = _.extend(model.rel, {value: req.query.rel});
        }
      } else {
        res.status(404).send('找不到对象');
        return;
      }
      break;
    case 'post':
      if(model.length > 0) {
        model = model[0];
        data.body = _.pick(data.body, model.post.columns);
        if(_.has(model.post, 'unique')) data.unique = model.post.unique;
        if(_.has(model.post, 'convert')) {
          model.post.convert.forEach(function(item){
            data.body[item.key] = item.func(data.body[item.key]);
          });
        }
        if(_.has(model.post, 'check')) {
          for(var i in model.post.check) {
            chkItem = model.post.check[i];
            chkItem = _.extend({
              func: _.isEmpty,
              reverse: false
            }, chkItem);
            if(chkItem.reverse) {
              if(!chkItem.func(data.body[chkItem.key])) {
                res.status(400).send(chkItem.message);
                return;
              }
            } else {
              if(chkItem.func(data.body[chkItem.key])) {
                res.status(400).send(chkItem.message);
                return;
              }
            }
          }
        }
        if(_.has(model.post, 'fixed')) {
          model.post.fixed.forEach(function(item){
            data.body[item.key] = item.value;
          });
        }
        if(_.has(model, 'rel')) {
          RelObject = AV.Object.extend(model.rel.name);
          data.body[model.rel.column] = new RelObject;
          data.body[model.rel.column].id = data.body[model.rel.id];
        }
      } else {
        res.status(404).send('找不到对象');
        return;
      }
      break;
    case 'put':
      if(model.length > 0) {
        model = model[0];
        data.body = _.pick(data.body, model.put.columns);
        if(_.has(model.put, 'convert')) {
          model.put.convert.forEach(function(item){
            data.body[item.key] = item.func(data.body[item.key]);
          });
        }
        if(_.has(model.put, 'check')) {
          for(var i in model.put.check) {
            chkItem = model.put.check[i];
            chkItem = _.extend({
              func: _.isEmpty,
              reverse: false
            }, chkItem);
            if(chkItem.reverse) {
              if(!chkItem.func(data.body[chkItem.key])) {
                res.status(400).send(chkItem.message);
                return;
              }
            } else {
              if(chkItem.func(data.body[chkItem.key])) {
                res.status(400).send(chkItem.message);
                return;
              }
            }
          }
        }
      } else {
        res.status(404).send('找不到对象');
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
  if(!_.isEmpty(data.body.rel)) {
    var AVRelObject = AV.Object.extend(data.body.rel.name),
        relObject = new AVRelObject;
    relObject.id = data.body.rel.value;
    query.equalTo(data.body.rel.column, relObject);
  }
  if(!_.isEmpty(data.body.columns)) {
    query.select(data.body.columns);
  }
  query.limit(data.body.size);
  query.skip(data.body.index * data.body.size);
  query.descending('createdAt');
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

  var AVObject = AV.Object.extend(data.objectName),
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