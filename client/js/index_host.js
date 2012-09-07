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
		client.on('quickshare.drop', function (hash, file) {

			var stream = client.send({event:'join', hash:hash});
			stream.on('data', function (data) {
				var event = data.event;
				if (event === "start") {
					client.emit('quickshare.start', hash, file);
				}
			});

		});

		// raised when the peer connects
		client.on('quickshare.start', function (hash, file) {
			var stream = client.send(file, {name:file.name, size:file.size, type:file.type});
			// Print progress
			var tx = 0;
			stream.on('data', function(data){
				console.log(Math.round(tx+=data.percent*100) + '% complete');
			});
		});
	});
});