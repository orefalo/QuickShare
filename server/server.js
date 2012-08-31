module.exports = function () {

	var path = require('path');
	var express = require('express')
		, config = require(path.join(__dirname, 'conf', 'general.js'));

	var app = express();

	require(path.join(__dirname, 'environments.js'))(express, app, config);
	require(path.join(__dirname, 'routes.js'))(app, config);

	var server = app.listen(app.get('port'), function () {
		console.log("Express " + app.get('env') + " server listening on port " + app.get('port'));
	});

	require(path.join(__dirname, 'server-iosockets.js'))(server);


};
