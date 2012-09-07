module.exports = function () {

	var path = require('path');
	var fs = require('fs');
	var http = require('http');
	var express = require('express');

	var app = express();

	require(path.join(__dirname, 'environments.js'))(express, app);

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


	var httpServer = http.createServer(app);

	var binaryServer = require('binaryjs').BinaryServer;
	var bs = binaryServer({server:httpServer});


//	var binaryServer = require('binaryjs').BinaryServer;
//	var bs = require('binaryjs').BinaryServer({server:httpServer});

	// Wait for new user connections
	bs.on('connection', function (client) {

		// Incoming stream from browsers: can be a file stram or an event stream
		client.on('stream', function (stream, meta) {

			if (meta) {
				var file = fs.createWriteStream('/tmp/' + meta.name);
				stream.pipe(file);

				stream.on('data', function (data) {
					// send progress updates to the client
					stream.write({percent:data.length / meta.size});
				});

			} else {
				stream.on('data', function (data) {
					var event = data.event;
					if (event === "join") {
						console.log(data.hash);
						stream.write({event:"start"});
					}
				});
			}

		});
	});

	httpServer.listen(app.get('port'));
	console.log("Express " + app.get('env') + " server listening on port " + app.get('port'));

};
