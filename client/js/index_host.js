//= require constants
//= require BG
//= require center
//= require dropzone_host
//= require canonicalize
//= require RandomString

var socket, reader;


function sliceChunk(file, chunkIndex, type) {

	var start = chunkIndex * CHUNK_SIZE;
	if (start > file.size)
		return;

	var end = start + CHUNK_SIZE;

	var fileSize = parseInt(file.size);
	if (end > fileSize)
		end = fileSize;

	var t = type || file.type;

	return file.slice(start, end, t);
}

$(function () {
	var url = canonicalize(document.location.href);

	var ws = url.protocol + '//' + url.host;

	socket = io.connect(ws, {
		'try multiple transports':true,
		'reconnect':true,
		'reconnection delay':500,
		'max reconnection attempts':10
	});

	socket.on('connect', function (data) {

		socket.on('error', function (code, str) {
			console.log(code + " " + str);
		});

		socket.on('getChunk', function (chunkIndex) {

			console.log("getChunk " + chunkIndex);

			if (chunkIndex === 0) {
				reader = new FileReader();
				reader.onerror = function (evt) {
					console.error("getChunk(" + DropZone.file + ", " + chunkIndex + ") = '" + evt.target.result + "'");
				};
				// TODO: Do something visual
			}

			// If we use onloadend, we need to check the readyState.
			reader.onload = function (evt) {
				var chunk = evt.target.result;
				console.log("emit.sendChunk " + chunkIndex);
				socket.emit('sendChunk', chunkIndex, chunk);

			};

			var blob = sliceChunk(DropZone.file, chunkIndex);
			if (blob)
				reader.readAsBinaryString(blob);
		});

		socket.on('done', function () {

		});


	});
});