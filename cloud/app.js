// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();
var sessions = require('client-sessions');
var avosExpressCookieSession = require('avos-express-cookie-session');
var _ = require('underscore');
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

app.get('/captcha/start/:howmany', function(req, res) {
	var visualCaptcha;

	// Initialize visualCaptcha
	visualCaptcha = require( 'visualcaptcha' )( req.client_sess, req.query.namespace );

	visualCaptcha.generate( req.params.howmany );

	// We have to send the frontend data to use on POST.
	res.status( 200 ).send( visualCaptcha.getFrontendData() );
});
app.get('/captcha/image/:index', function(req, res) {
	var visualCaptcha,
	isRetina = false;

	// Initialize visualCaptcha
	visualCaptcha = require( 'visualcaptcha' )( req.client_sess, req.query.namespace );

	// Default is non-retina
	if ( req.query.retina ) {
		isRetina = true;
	}

	visualCaptcha.streamImage( req.params.index, res, isRetina );
});

var verifyCaptcha = function(req, res, options) {
	var visualCaptcha = require( 'visualcaptcha' )( req.client_sess, req.query.namespace ),
		frontendData = visualCaptcha.getFrontendData(),
		imageAnswer = req.body[frontendData.imageFieldName],
		options = options || {};

	if( imageAnswer && visualCaptcha.validateImage(imageAnswer) ) {
		if(options.success && _.isFunction(options.success)) options.success();
	} else {
		if(options.fail && _.isFunction(options.fail)) {
			options.fail();
		} else {
			res.status(403).send('验证码不正确');
		}
	}
};
app.get('/user', function(req, res) {
	res.render('main', {
		title: '用户页面',
		main: '<div id="main"></div>',
		appname: 'user'
	});
});
app.post('/user', function(req, res) {
	switch(req.body.type) {
		case 'signin':
			verifyCaptcha(req, res, {
				success: function() {
					res.json(req.body);
				}
			});
			break;
		case 'signup':
			verifyCaptcha(req, res, {
				success: function() {
					res.json(req.body);
				}
			});
			break;
		case 'reset':
			verifyCaptcha(req, res, {
				success: function() {
					res.json(req.body);
				}
			});
			break;
		case 'activate':
			verifyCaptcha(req, res, {
				success: function() {
					res.json(req.body);
				}
			});
			break;
		default: 
			res.send('default');
	}
});

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();