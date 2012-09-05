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


	httpserver.listen(app.get('port'));
	console.log("Express " + app.get('env') + " server listening on port " + app.get('port'));





//	require(path.join(__dirname, 'server-iosockets.js'))(server);


};
