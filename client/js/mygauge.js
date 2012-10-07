///= require libs/gauge

var opts = {
	lines: 12, // The number of lines to draw
	angle: 0.35, // The length of each line
	lineWidth: 0.1, // The line thickness
	pointer: {
		length: 0.9, // The radius of the inner circle
		strokeWidth: 0.035, // The rotation offset
		color: '#000000' // Fill color
	},
	colorStart: '#6F6EA0',   // Colors
	colorStop: '#C0C0DB',    // just experiment with them
	strokeColor: '#EEEEEE',   // to see which ones work best for you
	generateGradient: true
};
var target = document.getElementById('gauge'); // your canvas element
var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 3000; // set max gauge value
gauge.animationSpeed = 32; // set animation speed (32 is default value)
gauge.set(1300); // set actual value