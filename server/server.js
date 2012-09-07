module.exports = function () {

	var path = require('path');
	var fs = require('fs');
	var http = require('http');
	var express = require('express');
	var config = require(path.join(__dirname, 'conf', 'general.js'));

	var app = express();

	require(path.join(__dirname, 'environments.js'))(express, app, config);
	require(path.join(__dirname, 'routes.js'))(app, config);

	var httpserver = http.createServer(app);

	var BinaryServer = require('binaryjs').BinaryServer;
	var bs = BinaryServer({server:httpserver});


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

	httpserver.listen(app.get('port'));
	console.log("Express " + app.get('env') + " server listening on port " + app.get('port'));

};
