
module.exports = function () {


	var shares = {};

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

		var myShare = shares[req.param('hash')];
		if (myShare) {

			myShare.peer = res;
			myShare.master.write({event:"start"});

		}

//		peerResponse = res;
//		theStreamToMaster.write({event:"start"});

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


		// Incoming stream from browsers: can be a file stream or an event stream
		client.on('stream', function (stream, meta) {

			// there is a meta when we stream a file
			if (meta) {

				var myShare = shares[meta.hash];
				if (myShare) {


					var peer = myShare.peer;

					peer.writeHead(200, {
						'Content-Type':meta.type,
						'Content-Length':meta.size,
						'Content-Disposition':'attachment; filename=' + meta.name
					});

					// Send progress back to client
					stream.on('data', function (data) {
						stream.write({tx:data.length / meta.size});
					});
					stream.on('end', function () {
						// remove the share after completion
						shares[meta.hash] = null;
					});

					stream.pipe(peer);

				}
			} else {
				stream.on('data', function (data) {

					var event = data.event;

					// that the initial join event raiser by the master
					if (event === "join") {

						var myShare = shares[data.hash];
						if (!myShare) {
							shares[data.hash] = {isStarted:false, master:stream};
						} else if (myShare.isStarted === true)
							console.log("Transfer already started");


					}
				});
			}

		});
	});

	httpServer.listen(app.get('port'));
	console.log("Express " + app.get('env') + " server listening on port " + app.get('port'));

};
