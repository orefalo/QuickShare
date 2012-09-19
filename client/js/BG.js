/**
 * Background canvas with a radial gradient
 */
var BG = BG || {};

BG.image = new Image();

BG.draw = function () {

	if (BG.image.src && BG.image.complete)
		BG.image.onload();
	else {

		// start the drawing once the image is loaded
		BG.image.onload = function () {

			var canvas = $("#BG")[0];
			var ctx = canvas.getContext("2d");

			var width = $(window).width();
			var height = $(window).height();
			var halfWidth = width / 2;
			var halfHeight = height / 2;

			canvas.width = width;
			canvas.height = height;

			// set the pattern
			ctx.fillStyle = ctx.createPattern(BG.image, "repeat");
			ctx.fillRect(0, 0, width, height);

			// set up gradient
			var grad = ctx.createRadialGradient(halfWidth, halfHeight, 0,
				halfWidth, halfHeight, halfWidth * 1.4);
			grad.addColorStop(0, 'rgba(0,0,0,0)');
			grad.addColorStop(1, 'rgba(0,0,0,1)');

			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, width, height);
			ctx.fill();
		};

		BG.image.src = "/images/moquette.jpeg";
	}
};


$(function () {

	BG.draw();
	$(window).on('resize', function () {
		BG.draw();
	});
});