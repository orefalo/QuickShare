module.exports = function (app, config) {

	app.get('/', function (req, res) {

		res.render('main.html', {
			partials:{body:'host.html'},
			css:css('host.css'),
			javascript:js('index_host.js')
		});
	});


	app.get('/:hash', function (req, res) {

		res.render('main.html', {
			partials:{body:'peer.html'},
			css:css('peer.css'),
			javascript:js('index_peer.js')
		});
	});

};