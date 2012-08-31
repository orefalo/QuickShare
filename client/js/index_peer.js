//= require constants
//= require BG
//= require center
//= require dropzone_peer
//= require canonicalize
//= require ../libs/idb.filesystem.js


function errorHandler(err) {

	var msg = 'An error occured: ';

	switch (err.code) {

		case FileError.ENCODING_ERR:
			msg += 'ENCODING_ERR:The URL is malformed. Make sure that the URL is complete and valid.';
			break;

		case FileError.INVALID_MODIFICATION_ERR:
			msg += 'INVALID_MODIFICATION_ERR:The modification requested is not allowed. For example, the app might be trying to move a directory into its own child or moving a file into its parent directory without changing its name.';
			break;

		case FileError.INVALID_STATE_ERR:
			msg += 'INVALID_STATE_ERR:The operation cannot be performed on the current state of the interface object. For example, the state that was cached in an interface object has changed since it was last read from disk.';
			break;

		case FileError.NO_MODIFICATION_ALLOWED_ERR:
			msg += 'NO_MODIFICATION_ALLOWED_ERR:The state of the underlying file system prevents any writing to a file or a directory.';
			break;

		case FileError.NOT_FOUND_ERR:
			msg += 'NOT_FOUND_ERR:A required file or directory could not be found at the time an operation was processed. For example, a file did not exist but was being opened.';
			break;


		case FileError.NOT_READABLE_ERR:
			msg += 'NOT_READABLE_ERR:The file or directory cannot be read, typically due to permission problems that occur after a reference to a file has been acquired (for example, the file or directory is concurrently locked by another application).';
			break;

		case FileError.PATH_EXISTS_ERR:
			msg += 'PATH_EXISTS_ERR:The file or directory with the same path already exists.';
			break;

		case FileError.QUOTA_EXCEEDED_ERR:
			msg += 'QUOTA_EXCEEDED_ERR:Either there is not enough remaining storage space or the storage quota was reached and the user declined to give more space to the database';
			break;

		case FileError.SECURITY_ERR:
			msg += 'SECURITY_ERR:Access to the files were denied for one of the following reasons: access from file://, too many calls are being made on file resources...etc';
			break;

		case FileError.TYPE_MISMATCH_ERR:
			msg += 'TYPE_MISMATCH_ERR:The app looked up an entry, but the entry found is of the wrong type. For example, the app is asking for a directory, when the entry is really a file.';
			break;

		default:
			msg += err.code + ' Unknown Error';
			break;
	}

	console.log(msg);
	alert(msg);
}

// File holder, contain file.name, file.type, file.size
var file;
var fs;

function writeChunk(chunk, callback) {

	fs.root.getFile(file.name, {create:true, exclusive:false}, function (fileEntry) {

		fileEntry.createWriter(function (fileWriter) {

			fileWriter.onerror = errorHandler;

			console.log("seek to " + fileWriter.length);
			if (fileWriter.length > 0) {
				fileWriter.seek(fileWriter.length);
			}
			var blob = new Blob([chunk], {type:file.type});

			fileWriter.onwrite = callback;

			console.log("write");

			fileWriter.write(blob);

		});
	}, errorHandler);
}

function getFileURL() {

	fs.root.getFile(file.name, {}, function (fileEntry) {

		var url = fileEntry.toURL();
		console.log(url);
//		window.open(url);
		$('#linkURL').attr('href', url);
		DropZone.setSlide(1);


	}, errorHandler);

}


$(function () {


	var url = canonicalize(document.location.href);

	var ws = url.protocol + '//' + url.host;

	var socket = io.connect(ws, {
		'try multiple transports':true,
		'reconnect':true,
		'reconnection delay':500,
		'max reconnection attempts':5
	});


	function initFS(thefs) {
		fs = thefs;

		// delete the file if it exists
		fs.root.getFile(file.name, {create:false}, function (fileEntry) {
			fileEntry.remove(function () {
				socket.emit('getChunk', 0);
			});
		}, function () {
			socket.emit('getChunk', 0);
		});
	}


	socket.on('connect', function (data) {

		var hash = url.pathname;

		if (hash.indexOf("/") === 0)
			hash = hash.substring(1);

		if (hash.length === 16)
			socket.emit('ready', hash);

		socket.on("error", function (code, str) {
			console.log(code + " " + str);
		});


		socket.on('start', function (theFile) {

			console.log("file:" + theFile.name + " " + theFile.size + " " + theFile.type);
			file = theFile;
			file.totalChunks = 1 + Math.floor(file.size / CHUNK_SIZE);

			window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
			window.requestFileSystem(window.TEMPORARY, MAX_FILE_SIZE, initFS, errorHandler);

		});

		// Save the chunk received from the master
		socket.on('sendChunk', function (chunkIndex, chunk) {

			var nextChunkIndex = parseInt(chunkIndex) + 1;

			var isLast = nextChunkIndex >= file.totalChunks;
			if (isLast) {
				socket.emit('done', hash);
				getFileURL();
			}
			else {
				console.log("received chunk " + chunkIndex);
				writeChunk(chunk, function () {
					socket.emit('getChunk', nextChunkIndex);
				});
			}
		});
	});

});