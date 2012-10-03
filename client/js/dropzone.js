/**
 * Create the class holding the action for the dom element drop-zone
 */

var dropZoneSize = 350 + (
	2 * 10
	) + 1;

var DropZone = DropZone || {};

DropZone.file = undefined;

DropZone.setSlide = function (index) {
	$("#slides").css("left", (
		-dropZoneSize * index
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

	var files = event.originalEvent.dataTransfer.files;

	var count = files.length;
	if (count > 1)
		alert("You may only drop one file at the time...");
	else {
		for (var i = 0; i < count; i++) {

			var file = files[i];
			DropZone.file = file;

			// Generate a random hash
			var hash = RandomString.gen(25);

			client.emit('quickshare.drop', hash, file);


			var clip = new ZeroClipboard.Client();

			clip.setText( '' ); // will be set later on mouseDown
			clip.setHandCursor( true );
			clip.setCSSEffects( true );

			clip.addEventListener( 'onMouseDown', function() {
				// set text to copy here
				clip.setText( "/get/" + hash );
				clip.destroy();
				alert("mouse down");
			} );

			clip.glue( 'linkURL', 'link' );

			//$('#linkURL').attr('href', "/get/" + hash);
			DropZone.setSlide(1);
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
