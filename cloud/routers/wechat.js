var uds = require('underscore.string');

var Account = AV.Object.extend('wxAccountList'),
    WechatUser = AV.Object.extend('wxFollowerList');

var defaultReply = function(msg, res) {
  res.reply('Hello' + msg.FromUserName);
};

var saveMsg = function(msg, type) {
  var Message = AV.Object.extend('wxMsg'+uds.capitalize(type));
  var message = new Message;
  message.set(msg);
  message.save(null, {
    error: function(obj, err){
      console.log('save message', msg, err);
    }
  });
};

module.exports = {
  text: function (msg, req, res, next) {
    res.reply('text');
    saveMsg(msg, 'text');
  },
  image: function (msg, req, res, next) {
    res.reply('image');
    saveMsg(msg, 'image');
  },
  voice: function (msg, req, res, next) {
    res.reply('voice');
    saveMsg(msg, 'voice');
  },
  video: function (msg, req, res, next) {
    res.reply('video');
    saveMsg(msg, 'video');
  },
  location: function (msg, req, res, next) {
    res.reply('location');
    saveMsg(msg, 'location');
  },
  link: function (msg, req, res, next) {
    res.reply('link');
    saveMsg(msg, 'link');
  },
  event: function (msg, req, res, next) {
    if(msg.Event=='subscribe' || msg.Event=='unsubscribe') {
      var queryUser = new AV.Query(WechatUser);
      queryUser.equalTo('openid', msg.FromUserName);
      queryUser.first({
        success: function(user) {
          if(user) { //old follower
            user.set({
              status: msg.Event=='subscribe' ? 1 : 0,
              time: parseInt(msg.CreateTime)
            });
            user.save(null).then(function(user) {
              defaultReply(msg, res);
            }, function(obj, err) {
              res.reply(err.message);
            });
          } else { //new follower
            var queryAccount = new AV.Query(Account);
            queryAccount.equalTo('sourceid', msg.ToUserName);
            queryAccount.first({
              success: function(account) {
                if(account) {
                  user = new WechatUser;
                  user.set({
                    openid: msg.FromUserName,
                    sourceId: msg.ToUserName,
                    status: msg.Event=='subscribe' ? 1 : 0,
                    time: parseInt(msg.CreateTime),
                    account: account
                  });
                  user.save(null).then(function(user) {
                    defaultReply(msg, res);
                  }, function(obj, err) {
                    res.reply(err.message);
                  });
                } else {
                  console.log('Not Found account', msg);
                }

              },
              error: function(obj, err) {
                res.reply(err.message);
              }
            });
          }

        },
        error: function(err) {
          res.reply(err.message);
        }
      });
    }
    saveMsg(msg, 'event');
  }
};