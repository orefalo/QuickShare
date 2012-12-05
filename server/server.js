// renders a static page
function renderStatic(res, page) {

	res.render('main_template.html', {
		partials:{body:page},
		css:css('index_static.css'),
		javascript:js('index_static.js')
	});
}

module.exports = function () {

	// holds hash->{isStarted:true/false, master: binaryjs_stream, peer:response }
	var shares = {};

	var path = require('path');
	var fs = require('fs');
	var http = require('http');
	var express = require('express');
	var dateFormat = require('dateformat');

	var app = express();

	require(path.join(__dirname, 'environments.js'))(express, app);

	app.get('/', function (req, res) {

		res.render('main_template.html', {
			partials:{body:'index_host.html'},
			css:css('index_host.css'),
			javascript:js('index_host.js')
		});
	});


	app.get(/([A-Za-z0-9]{25})$/, function (req, res) {

		var hash = req.params[0];

		console.log(dateFormat(new Date(), "isoDateTime") + " hash " + hash);

		var myShare = shares[hash];
		if (myShare && myShare.isStarted === false) {

			myShare.peer = res;
			myShare.master.write({event:"start"});
		} else {

			// Download already started
			renderStatic(res, 'alreadyconsumed.html');
		}

	});

	app.get('/termsofuse', function (req, res) {
		renderStatic(res, 'termsofuse.html');
	});

	app.get('/browserissue', function (req, res) {
		renderStatic(res, 'browserissue.html');
	});

	app.get('/about', function (req, res) {
		renderStatic(res, 'about.html');
	});

	app.get('/privacypolicy', function (req, res) {
		renderStatic(res, 'privacypolicy.html');
	});

	app.use(function (req, res, next) {
		renderStatic(res, '404.html');
	});

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

			// It's a file! there is a meta
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
					 * @param {{event: string, data:string}} data
					 */
						function (data) {

						var event = data.event;

						// That's the initial join event raiser by the master
						if (event === "join") {

							/** @type {{isStarted:boolean, master, peer}} **/
							var myShare = shares[data.hash];
							if (!myShare) {
								shares[data.hash] = {isStarted:false, master:stream};
							} else if (myShare.isStarted === true)
								console.log(dateFormat(new Date(), "isoDateTime") + "Transfer already started");

						}
					});
			}

		});
	});

	httpServer.listen(app.get('port'), null, null, function () {

//		if (app.get('env') == "production") {
//
//			// Assuming this process was started as root, change the owner
//			try {
//
//				console.log('Old User ID: ' + process.getuid() + ', Old Group ID: ' + process.getgid());
//				process.setuid('web');
//				process.setgid('users');
//				console.log('New User ID: ' + process.getuid() + ', New Group ID: ' + process.getgid());
//
//			} catch (err) {
//				console.log('Cowardly refusing to keep the process alive as root.');
//				process.exit(1);
//			}
//		}

	});
	console.log(dateFormat(new Date(), "isoDateTime") + " Express " + app.get('env') + " server listening on port " + app.get('port'));

};
