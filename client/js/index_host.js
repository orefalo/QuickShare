//= require BG
//= require dropzone
//= require canonicalize


var client;

$(function () {


	var dropzone = $("#dropzone");
	dropzone.on("dragover", DropZone.onDragOver);
	dropzone.on("dragleave", DropZone.onDragLeave);
	dropzone.on("drop", DropZone.onDrop);


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

			// fix ui issue on drop
			dropzone.removeClass("hover");

			var link = "/get/" + hash;
			$('#linkURL').attr('href', link).val(link);
			DropZone.setSlide(1);

			var stream = client.send({event:'join', hash:hash});
			stream.on('data', function (data) {

				var event = data.event;
				if (event === "start") {

					DropZone.setSlide(2);

					var stream = client.send(file, {name:file.name, size:file.size, type:file.type, hash:hash});

					var percentElement = $('#progressStatus');
					var tx = 0;
					stream.on('data', function (data) {

						tx += data.tx * 100;
						var percent = Math.round(tx);
						percentElement.html(percent + "<span>%</span>");

						if (percent === 100)
							DropZone.setSlide(3);

						console.log(percent + '% complete');
					});

				}
			});

		});

	});
});