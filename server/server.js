var theClient;
var peerResponse;
var theStreamToMaster;
var theHash;

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

	app.get('/get/:hash', function (req, res) {

		console.log("hash " + req);

		peerResponse = res;
		theClient.emit("quickshare.peerconnected");

//		res.render('main.html', {
//			partials:{body:'peer.html'},
//			css:css('peer.css'),
//			javascript:js('index_peer.js')
//		});
	});


	var httpServer = http.createServer(app);

	var binaryServer = require('binaryjs').BinaryServer;
	var bs = binaryServer({server:httpServer});


	// Wait for new user connections
	bs.on('connection', function (client) {


		client.on('error', function (err1, err2) {
			console.log(err1);
			console.log(err2);
		});

		theClient = client;

		client.on('quickshare.peerconnected', function () {

			theStreamToMaster.write({event:"start"});
		});

		// Incoming stream from browsers: can be a file stream or an event stream
		client.on('stream', function (stream, meta) {

			// there is a meta when we stream a file
			if (meta) {

				peerResponse.writeHead(200, {
					'Content-Type':meta.type,
					'Content-Length':meta.size,
					'Content-Disposition':'attachment; filename=' + meta.name
				});
				stream.pipe(peerResponse);

				// Send progress back to client
				stream.on('data', function (data) {
					stream.write({tx:data.length / meta.size});
				});

//				stream.on('end', function () {
//					peerResponse.close();
//				});

			} else {
				stream.on('data', function (data) {
					var event = data.event;
					// that the initial join event raiser by the master
					if (event === "join") {
						theStreamToMaster = stream;
						theHash = data.hash;
						console.log(data.hash);
					}
				});
			}

		});
	});

	httpServer.listen(app.get('port'));
	console.log("Express " + app.get('env') + " server listening on port " + app.get('port'));

};
