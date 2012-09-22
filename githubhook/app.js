var githubhook = require('githubhook'),
	servers = {
		// that's the url webhook to define in github
		// http://www.ugot.com:9999/472398FE-AB54-413A-93F0-3E1918F966F1
		'472398FE-AB54-413A-93F0-3E1918F966F1':'https://github.com/orefalo/QuickShare'
	};

var thishook = githubhook(9999, servers, function (err, payload) {
	if (!err) {

		// console.log(payload);
		console.log("Branch "+payload.ref);

		if (payload.ref === "refs/heads/PROD") {
			console.log("GOOD");

			//TODO: trigger a shell script
		}
	} else {
		console.log(err);
	}
});