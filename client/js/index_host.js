//= require constants
//= require BG
//= require center
//= require dropzone_host
//= require canonicalize
//= require UUID

var client;

$(function () {
	var url = canonicalize(document.location.href);

	alert(url.host);
	client = new BinaryClient('ws://' + url.host);

	alert(client);
	client.on('open', function () {

		client.on('drop', function (hash, file) {

			var stream = client.send({event:'join', hash:hash});
			stream.on('data', function (data) {
				console.log(data);
			});


		});


	});

});