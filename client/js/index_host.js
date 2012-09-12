//= require ../libs/jquery-1.8.js
//= require ../libs/binary.js
//= require constants
//= require BG
//= require center
//= require dropzone
//= require canonicalize
//= require UUID

var client;

$(function () {
	var url = canonicalize(document.location.href);

	client = new BinaryClient('ws://' + url.host);

	client.on('open', function () {


		client.on('error', function (err1, err2) {
			console.log(err1);
			console.log(err2);
		});

		// triggered by the dropzone
		client.on('quickshare.drop', function (hash, file) {
			console.log("quickshare.drop");
			var stream = client.send({event:'join', hash:hash});
			stream.on('data', function (data) {

				var event = data.event;
				if (event === "start") {

					var stream = client.send(file, {name:file.name, size:file.size, type:file.type, hash:hash});

					var tx = 0;
					stream.on('data', function (data) {
						console.log(Math.round(tx += data.tx * 100) + '% complete');
					});

				}
			});

		});

	});
});