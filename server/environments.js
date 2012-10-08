var path = require('path'),
	cons = require('consolidate'),
	connectDomain = require('connect-domain'),
    config = require(path.join(__dirname, 'conf', 'defaults.js'));

module.exports = function (express, app) {

	app.engine('html', cons.whiskers);
	app.set('views', path.join(__dirname, '..', 'client', 'views'));
	app.set('view engine', 'html');
	app.use(app.router);

	app.use(require('connect-assets')({src:"client"}));

	app.use(express.favicon());
	app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

	var env = app.get('env');

	if ('development' === env) {

		config.extend(require(path.join(__dirname, 'conf', 'development.js')));

		app.use(express.errorHandler({
			dumpExceptions:true,
			showStack:true
		}));

		// Pretty template rendering
		app.locals.pretty = true;

		app.use(express.logger('dev'));
		app.set('port', config.port || 3000);

	} else if ('production' === env) {

		config.extend(require(path.join(__dirname, 'conf', 'production.js')));

		// Enable template caching
		app.locals.cache = true;

		app.use(express.timeout(6000));
		app.use(express.limit('5.5mb'));
		app.use(express.staticCache());

		app.use(express.errorHandler());
		app.use(express.logger());

		app.set('port', config.port || 3000);
	}

	// Trap runtime exceptions without restart
	app.use(connectDomain(function (err, req, res) {
		res.end(err.message);
	}));

};