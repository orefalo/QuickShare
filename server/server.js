module.exports = function () {

	// holds hash->{isStarted:true/false, master: binaryjs_stream, peer:response }
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


	// /^\/commits\/([A-Za-z0-9]{25})$/
	app.get(/\/get\/(^[A-Za-z0-9]{25})$/, function (req, res) {


		var hash = req.params[0];

		console.log("hash " + hash);

		var myShare = shares[hash];
		if (myShare && myShare.isStarted === false) {

			myShare.peer = res;
			myShare.master.write({event:"start"});
		} else {

			// download already started
			res.render('main.html', {
				partials:{body:'peer.html'},
				css:css('peer.css'),
				javascript:js('index_peer.js')
			});
		}

	});


//	app.get('*', function(req, res){
//		// download already started
//		res.render('main.html', {
//			partials:{body:'404.html'},
//			css:css('peer.css'),
//			javascript:js('index_peer.js')
//		});
//	});


	var httpServer = http.createServer(app);
	var bs = require('binaryjs').BinaryServer({server:httpServer});

	// Wait for new user connections
	bs.on('connection', function (client) {

		client.on('error', function (err1, err2) {
			console.log(err1);
			console.log(err2);
		});


		// Incoming stream from browsers: can be a file stream or an event stream
		client.on('stream', function (stream, meta) {

			// it's a file! there is a meta
			if (meta) {

				/** @type {{isStarted:boolean, master, peer}} **/
				var myShare = shares[meta.hash];
				if (myShare) {

					myShare.isStarted = true;

					myShare.peer.writeHead(200, {
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
						delete shares[meta.hash];
					});

					stream.pipe(myShare.peer);

				}

			} else {

				stream.on('data',

					/**
					 *
					 * @param {{event: string, data:string}} data
					 */
						function (data) {

						var event = data.event;

						// that the initial join event raiser by the master
						if (event === "join") {

							/** @type {{isStarted:boolean, master, peer}} **/
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
