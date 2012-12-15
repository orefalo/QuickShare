/**
 * Create the class holding the action for the dom element drop-zone
 */

//= require RandomString
//= require flipper
//= require labels

var flipper=new Flipper();
var labels=new Labels();

var DropZone = DropZone || {};

DropZone.setSlide = function (index) {
	flipper.setTo(index);
	labels.setTo(index);
};

DropZone.stopPropagation = function (event) {
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

			// Generate a random hash
			var hash = RandomString.gen(25);
			var file = files[i];
			client.emit('quickshare.drop', hash, file);
		}
	}
	return false;
};

