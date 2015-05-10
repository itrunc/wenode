var Captcha = require( 'visualcaptcha' ),
	_ = require('underscore');

var render = function(req, res) {
	res.render('main', {
		title: '用户页面',
		main: '<div id="main"></div>',
		appname: 'user'
	});
};

var startCaptcha = function(req, res) {
	var captcha = Captcha( req.client_sess, req.query.namespace );
	captcha.generate( req.params.howmany );
	res.status( 200 ).send( captcha.getFrontendData() );
};

var replyImageCaptcha = function(req, res) {
	var captcha = Captcha( req.client_sess, req.query.namespace ),
		isRetina = false;
	// Default is non-retina
	if ( req.query.retina ) {
		isRetina = true;
	}
	captcha.streamImage( req.params.index, res, isRetina );
};

var verifyCaptcha = function(req, res, callback) {
	var captcha = Captcha( req.client_sess, req.query.namespace ),
		frontendData = captcha.getFrontendData(),
		imageAnswer = req.body[frontendData.imageFieldName];

	if( imageAnswer && captcha.validateImage(imageAnswer) ) {
		if(_.isFunction(callback)) callback(req, res);
	} else {
		res.status(403).send('验证码不正确');
	}
};

var signIn = function(req, res) {
	AV.User.logIn(req.body.username, req.body.password).then(function() {
		res.status(200).send('/');
	}, function(error) {
		res.status(500).json(error);
	});
};

var signUp = function(req, res) {
	if(req.body.password === req.body.password2) {
		AV.User.logOut();
		var user = new AV.User();
		user.set({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		});
		user.signUp(null, {
			success: function(obj) {
				res.status(200).json({
					title: '注册成功',
					message: '请登录您的邮箱: '+req.body.email+' 进行验证',
					url: '/user#signin'
				});
			},
			error: function(obj, err) {
				res.status(500).json(err);
			}
		});
	} else {
		res.status(403).send('确认密码与密码不一致');
	}
};

var post = function(req, res) {
	switch(req.body.type) {
		case 'signin':
			verifyCaptcha(req, res, signIn);
			break;
		case 'signup':
			verifyCaptcha(req, res, signUp);
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
};

module.exports = {
	render: render,
	startCaptcha: startCaptcha,
	replyImageCaptcha: replyImageCaptcha,
	post: post
};