var githubhook = require('./githubhook.js');
var path = require('path');
var exec = require('child_process').exec;
var dateFormat = require('dateformat');

var servers = {
	// that's the url webhook to define in github, generate id with uuidgen
	// http://www.ugot.com:9999/472398FE-AB54-413A-93F0-3E1918F966F1
	'79a96853-5920-4654-935b-b4e778394f52':'https://github.com/orefalo/QuickShare'
};

var thishook = githubhook(9999, servers, function (err, payload) {
	if (!err) {

		// console.log(payload);
		console.log("Received request for branch " + payload.ref);

		if (payload.ref === "refs/heads/PROD") {
			console.log(dateFormat(new Date(), "isoDateTime") + ' Touche...');

			var child = exec(path.join(__dirname, "./hook.sh"), function (error, stdout, stderr) {
				var result = "stdout:" + stdout;
				if (stderr) {
					result += "\nstderr:";
					result += stderr;
				}
				console.log(result);
			});
		}
	}
});
