

var render = function(req, res) {
	res.render('main', {
		title: '管理页面',
		main: '<header id="menu"><div class="progress"><div class="indeterminate"></div></div></header><div id="main"></div>',
		appname: 'admin'
	});
};

module.exports = {
	render: render
};