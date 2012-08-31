var http = require('http'),
	fileSystem = require('fs'),
	path = require('path');

var server = http.createServer(function (request, response) {
	var filePath = path.join(__dirname, 'AstronomyCast Ep. 216 - Archaeoastronomy.mp3');
	var stat = fileSystem.statSync(filePath);

	response.writeHead(200, {
		'Content-Type':'audio/mpeg',
		'Content-Length':stat.size
	});

	var readStream = fileSystem.createReadStream(filePath);
	readStream.on('data', function (data) {
		var flushed = response.write(data);
		// Pause the read stream when the write stream gets saturated
		if (!flushed)
			readStream.pause();
	});

	response.on('drain', function () {
		// Resume the read stream when the write stream gets hungry
		readStream.resume();
	});

	readStream.on('end', function () {
		response.end();
	});
});

server.listen(2000);