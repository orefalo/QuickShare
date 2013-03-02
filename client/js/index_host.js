//= require BG
//= require dropzone
//= require canonicalize
//= require ../libs/ua-parser.js
//= require ../libs/gauge
//= require ../libs/binary.js

var client;

$(function () {

	// Figure the browser engine
	var parser = new UAParser();
	parser.setUA(navigator.userAgent);
	var v = parser.getResult().engine;
	console.log(v.name + " " + v.version);


	// SETUP THE GAUGE
	var opts = {
		lines:12, // The number of lines to draw
		angle:0.35, // The length of each line
		lineWidth:0.1, // The line thickness
		pointer:{
			length:0.9, // The radius of the inner circle
			strokeWidth:0.035, // The rotation offset
			color:'#000000' // Fill color
		},
		colorStart:'#6F6EA0', // Colors
		colorStop:'#C0C0DB', // just experiment with them
		strokeColor:'#EEEEEE', // to see which ones work best for you
		generateGradient:false
	};
	var target = document.getElementById('gauge'); // your canvas element
	var gauge = new Donut(target).setOptions(opts); // create sexy gauge!

	gauge.setTextField(document.getElementById("progress-textfield"));

	gauge.maxValue = 100; // set max gauge value
	gauge.animationSpeed = 32; // set animation speed (32 is default value)
	gauge.set(0); // set actual value


	// SETUP THE DROPZONE
	var dropzone = $("#dropzone");
	dropzone.on("dragover", DropZone.onDragOver);
	dropzone.on("dragleave", DropZone.onDragLeave);
	dropzone.on("drop", DropZone.onDrop);


	var url = canonicalize(document.location.href);

	console.log("Client is at " + url.host);

	client = new BinaryClient('ws://' + url.host);

	client.on('open', function () {

		client.on('error', function (err1, err2) {
			console.log(err1);
			console.log(err2);
		});

		// triggered by the dropzone
		client.on('quickshare.drop', function (hash, file) {

			// fix ui issue on drop
			dropzone.removeClass("hover");
			$('#arrow').removeClass("arrow_anim");

			$('#linkURL').bind('mousedown', function () {
				var link = url + "get/" + hash;
				window.prompt('Press CTRL+C, then ENTER', link);
				return false;
			});

			DropZone.setSlide(1);

			var stream = client.send({event:'join', hash:hash});
			stream.on('data', function (data) {

				var event = data.event;
				if (event === "start") {

					DropZone.setSlide(2);

					var stream = client.send(file, {name:file.name, size:file.size, type:file.type, hash:hash});
					var tx = 0;

					stream.on('data', function (data) {

						tx += data.tx * 100;
						var percent = Math.round(tx);
						gauge.set(percent);

						if (percent === 100)
							DropZone.setSlide(3);

					});


				}
			});

		});

	});
});