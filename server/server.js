module.exports = function () {

	var path = require('path');
	var http = require('http');
	var express = require('express');
	var config = require(path.join(__dirname, 'conf', 'general.js'));

	var app = express();

	require(path.join(__dirname, 'environments.js'))(express, app, config);
	require(path.join(__dirname, 'routes.js'))(app, config);

	var httpserver = http.createServer(app);

	var BinaryServer = require('binaryjs').BinaryServer;
	var bs = BinaryServer({server: httpserver});



	// Wait for new user connections
	bs.on('connection', function(client){
		// Incoming stream from browsers
		client.on('stream', function(stream, meta){
			//
			var file = fs.createWriteStream(__dirname+ '/public/' + meta.name);
			stream.pipe(file);
			//
			// Send progress back
			stream.on('data', function(data){
				stream.write({rx: data.length / meta.size});
			});
			//
		});
	});


	httpserver.listen(app.get('port'));
	console.log("Express " + app.get('env') + " server listening on port " + app.get('port'));





//	require(path.join(__dirname, 'server-iosockets.js'))(server);


};
