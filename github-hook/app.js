var gith = require('gith').create(9999);

gith({
	repo:'git@github.com:orefalo/QuickShare.git',
	branch:/PROD/
}).on('file:all', function (payload) {
	console.log('Post-receive happened!');
});