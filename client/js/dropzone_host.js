/**
 * Create the class holding the action for the dom element drop-zone
 */

var DropZone = DropZone || {};

DropZone.file = undefined;

DropZone.setSlide = function (index) {
	$("#slides").css("left", (
		-270 * index
		) + "px");
};


DropZone.stopPropagation = function (event) {
	console.log("stopPropagation");
	event.stopPropagation();
	event.preventDefault();
	return false;
};

DropZone.onDragOver = function (event) {

	$("#dropzone").addClass('hover');
	return DropZone.stopPropagation(event);
};


DropZone.onDragLeave = function (event) {

	$("#dropzone").removeClass('hover');
	return DropZone.stopPropagation(event);
};

DropZone.onDrop = function (event) {

	DropZone.stopPropagation(event);

	console.log("onDrop");

	var files = event.originalEvent.dataTransfer.files;

	var count = files.length;
	if (count > 1) {
		alert("You may only drop one file at the time...");
	}

	for (var i = 0; i < count; i++) {
		if (files[i].size < MAX_FILE_SIZE) {

			var file = files[i];
			DropZone.file = file;

			// Generate a random hash
			var hash = UUID.gen();

			client.emit('quickshare.drop', hash, file);

			$('#linkURL').attr('href', "/get/" + hash);
			DropZone.setSlide(1);

		} else {
			alert("file is too big, needs to be below 5mb.");
		}
	}

	return false;
};


$(function () {

	var dropzone = $("#dropzone");
	dropzone.on("dragover", DropZone.onDragOver);
	dropzone.on("dragleave", DropZone.onDragLeave);
	dropzone.on("drop", DropZone.onDrop);

});
