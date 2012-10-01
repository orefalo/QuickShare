/**
 * Centers the dropzone on the visual area
 *
 * TODO: REPLACE WITH FLEX LAYOUT
 */
$(function () {

	var w = $(window);
	var myResize = function () {

		var p = $('#panel');
		p.css({
			position:'absolute',
			left:(w.width() - p.outerWidth()) / 2,
			top:(w.height() - p.outerHeight()) / 2
		});
	};

	myResize();
	w.on('resize', myResize);
});