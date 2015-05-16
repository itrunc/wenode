// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();
var sessions = require('client-sessions');
var avosExpressCookieSession = require('avos-express-cookie-session');
var _ = require('underscore'),
    userApp = require('cloud/routers/user.js'),
    adminApp = require('cloud/routers/admin.js'),
    wechatHandler = require('cloud/routers/wechat.js');
// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

app.use(express.cookieParser('wenode cookies secure'));
app.use(avosExpressCookieSession({
	cookie: {maxAge: 3600000},
	fetchUser: true
}));

app.use( sessions({
	cookieName: 'client_sess',
	secret: 'someRandomSecret!',
	duration: 24 * 60 * 60 * 1000,
	activeDuration: 1000 * 60 * 5
}) );

//----------------------------

var wechat = require('wechat');
app.use(express.query());
app.use('/interface/wechat', wechat({
  //appid: '',
  //encodingAESKey: '',
  token: 'wenode_avosapps_com'
}).text(wechatHandler.text).image(wechatHandler.image).voice(wechatHandler.voice).video(wechatHandler.video).location(wechatHandler.location).link(wechatHandler.link).event(wechatHandler.event).middlewarify());

//-----------------------------

app.get('/captcha/start/:howmany', userApp.startCaptcha);
app.get('/captcha/image/:index', userApp.replyImageCaptcha);
app.get('/user', userApp.render);
app.get('/user/logout', userApp.logOut);
app.post('/user', userApp.verifyCaptcha, userApp.post);

app.get('/admin', /*adminApp.shouldLogin, */adminApp.render);
app.post('/admin/model/:model', adminApp.shouldLogin, adminApp.filterData, adminApp.createModel);
app.get('/admin/model/:model', adminApp.shouldLogin, adminApp.filterData, adminApp.fetchModels);
app.put('/admin/model/:model/:id', adminApp.shouldLogin, adminApp.filterData, adminApp.updateModel);
app.delete('/admin/model/:model/:id', adminApp.shouldLogin, adminApp.filterData, adminApp.destroyModel);

app.listen();