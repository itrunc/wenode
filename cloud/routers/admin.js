var _ = require('underscore'),
	uds = require('underscore.string');
var prefix = 'wx';

var ObjectList = {
  account: 'wxAccountList',
  follower: 'wxFollowerList',
  text: 'wxTextList',
  news: 'wxNewsList',
  blog: 'wxBlogList'
};

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

function filterData(req, res, next) {
  var data = {
    objectName: prefix + uds.classify(req.params.model),
    objectId: req.params.id,
    body: req.body,
    unique: []
  };
  var columns = [];
  var relValue = '';
  var RelObject;
  switch(req.route.method) {
    case 'get':
      data.body = {
        index: req.query.index || 0,
        size: req.query.size || 10,
        rel: {},
        columns: []
      };
      switch(data.objectName) {
        case ObjectList.account:
          data.body.columns = ['sourceid','code','name','type','intro','appid','appSecret','token','encodingAESKey','method'];
          break;
        
        case ObjectList.follower:
          relValue = req.query.rel;
          if(relValue && _.isString(relValue)) {
            data.body.rel = {
              objectName: ObjectList.account,
              column: 'account',
              value: relValue
            }
          }
          data.body.columns = ['sourceid','email','phone','name','time','openid','status'];
          break;

        case ObjectList.text:
          relValue = req.query.rel;
          if(relValue && _.isString(relValue)) {
            data.body.rel = {
              objectName: ObjectList.account,
              column: 'account',
              value: relValue
            }
          }
          data.body.columns = ['accountid','content','keywords'];
          break;

        case ObjectList.news:
          relValue = req.query.rel;
          if(relValue && _.isString(relValue)) {
            data.body.rel = {
              objectName: ObjectList.account,
              column: 'account',
              value: relValue
            }
          }
          data.body.columns = ['accountid','items','keywords'];
          break;

        case ObjectList.blog:
          data.body.columns = ['title','markdown','html','preview','tags'];
          break;
        default:
          break;
      }
      break;
    case 'post':
      switch(data.objectName) {
        case ObjectList.account:
          columns = ['sourceid','code','name','type','intro','appid','appSecret','token','encodingAESKey','method'];
          data.unique = ['sourceid'];
          data.body = _.pick(data.body, columns);
          data.body.token = 'wenode.avosapps.com';
          if( _.isEmpty(data.body.sourceid) ) {
            res.status(400).send('原始ID不能为空');
            return;
          }
          break;

        case ObjectList.text:
          columns = ['accountid','content','keywords'];
          data.body = _.pick(data.body, columns);
          if(_.isEmpty(data.body.content)) {
            res.status(400).send('消息内容不能为空');
            return;
          }
          if(_.isEmpty(data.body.accountid)) {
            res.status(400).send('必须关联公众号');
            return;
          }
          data.body.keywords = toKeyword(data.body.keywords);
          if(data.body.keywords.length <= 0) {
            res.status(400).send('关键词格式不对');
            return;
          }
          RelObject = AV.Object.extend(ObjectList.account);
          data.body.account = new RelObject;
          data.body.account.id = data.body.accountid;
          break;

        case ObjectList.news:
          columns = ['accountid','items','keywords'];
          data.body = _.pick(data.body, columns);
          if(!_.isArray(data.body.items) || _.isEmpty(data.body.items)) {
            res.status(400).send('图文消息列表格式不对');
            return;
          }
          if(_.isEmpty(data.body.accountid)) {
            res.status(400).send('必须关联公众号');
            return;
          }
          data.body.keywords = toKeyword(data.body.keywords);
          if(data.body.keywords.length <= 0) {
            res.status(400).send('关键词格式不对');
            return;
          }
          RelObject = AV.Object.extend(ObjectList.account);
          data.body.account = new RelObject;
          data.body.account.id = data.body.accountid;
          break;

        case ObjectList.blog:
          columns = ['title','markdown','html','preview','tags'];
          data.body = _.pick(data.body, columns);
          data.body.tags = toKeyword(data.body.tags);
          break;

        default:
          res.status(400).send('对不起，不支持您请求创建的对象');
          return;
      }
      break;
    case 'put':
      switch(data.objectName) {
        case ObjectList.account:
          columns = ['intro','appSecret','encodingAESKey','method'];
          data.body = _.pick(data.body, columns);
          break;
        case ObjectList.follower:
          columns = ['name','email','phone'];
          data.body = _.pick(data.body, columns);
          break;
        case ObjectList.text:
          columns = ['content','keywords'];
          data.body = _.pick(data.body, columns);
          if(_.isEmpty(data.body.content)) {
            res.status(400).send('消息内容不能为空');
            return;
          }
          data.body.keywords = toKeyword(data.body.keywords);
          if(data.body.keywords.length <= 0) {
            res.status(400).send('关键词格式不对');
            return;
          }
          break;
        case ObjectList.news:
          columns = ['items','keywords'];
          data.body = _.pick(data.body, columns);
          if(!_.isArray(data.body.items) || _.isEmpty(data.body.items)) {
            res.status(400).send('图文消息列表格式不对');
            return;
          }
          data.body.keywords = toKeyword(data.body.keywords);
          if(data.body.keywords.length <= 0) {
            res.status(400).send('关键词格式不对');
            return;
          }
          break;
        case ObjectList.blog:
          columns = ['title','markdown','html','preview','tags'];
          data.body = _.pick(data.body, columns);
          data.body.tags = toKeyword(data.body.tags);
          break;
        default:
          res.status(400).send('对不起，不支持您请求更新的对象');
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
    var AVRelObject = AV.Object.extend(data.body.rel.objectName),
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