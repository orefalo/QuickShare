//= require constants
//= require BG
//= require center
//= require dropzone_host
//= require canonicalize
//= require UUID

var client, stream;

$(function () {
	var url = canonicalize(document.location.href);

	alert(url.host);
	client = new BinaryClient('ws://' + url.host);

	alert(client);
	client.on('open', function () {




	});

});