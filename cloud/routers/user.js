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

var verifyCaptcha = function(req, res, next) {
	var captcha = Captcha( req.client_sess, req.query.namespace ),
		frontendData = captcha.getFrontendData(),
		imageAnswer = req.body[frontendData.imageFieldName];

	if( imageAnswer && captcha.validateImage(imageAnswer) ) {
		next();
	} else {
		res.status(403).send('验证码不正确');
	}
};

var signIn = function(req, res) {
	AV.User.logIn(req.body.username, req.body.password).then(function() {
		res.status(200).send('/admin');
	}, function(error) {
		res.status(500).json(error);
	});
};

var logOut = function(req, res) {
	AV.User.logOut();
	res.redirect('/');
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

var reset = function(req, res) {
	AV.User.requestPasswordReset(req.body.email, {
		success: function() {
			res.status(200).json({
				title: '邮件已发送',
				message: '请登录您的邮箱: '+req.body.email+' 查收重置密码的邮件',
				url: '/'
			});
		},
		error: function(err) {
			res.status(500).json(err);
		}
	});
};

var activate = function(req, res) {
	 AV.User.requestEmailVerify(req.body.email, {
		success: function() {
			res.status(200).json({
				title: '邮件已发送',
				message: '请登录您的邮箱: '+req.body.email+' 查收激活邮件',
				url: '/'
			});
		},
		error: function(err) {
			res.status(500).json(err);
		}
	});
};

var post = function(req, res) {
	switch(req.body.type) {
		case 'signin':
      signIn(req, res);
			break;
		case 'signup':
      signUp(req, res);
			break;
		case 'reset':
      reset(req, res);
			break;
		case 'activate':
			activate(req, res);
			break;
		default: 
			res.send('default');
	}
};

module.exports = {
	render: render,
	startCaptcha: startCaptcha,
	replyImageCaptcha: replyImageCaptcha,
  verifyCaptcha: verifyCaptcha,
	post: post,
	logOut: logOut
};