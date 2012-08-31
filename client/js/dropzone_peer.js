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
