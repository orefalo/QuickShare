//= require constants
//= require BG
//= require center
//= require dropzone_host
//= require canonicalize
//= require UUID

var client;

$(function () {
	var url = canonicalize(document.location.href);

	client = new BinaryClient('ws://' + url.host);
	client.on('open', function () {

		// triggered by the dropzone
		client.on('drop', function (hash, file) {

			var stream = client.send({event:'join', hash:hash});
			stream.on('data', function (data) {
				console.log(data);
			});

		});

	});

});