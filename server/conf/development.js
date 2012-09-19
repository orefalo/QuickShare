var os = require('os');

// get the local IP address
var interfaces = os.networkInterfaces();
var addresses = [];
for (k in interfaces) {
	for (k2 in interfaces[k]) {
		var address = interfaces[k][k2];
		if (address.family == 'IPv4' && !address.internal) {
			addresses.push(address.address);
		}
	}
}

console.log(addresses);

var params = {
	port:3000,
	fontend_server: addresses[0]
};

module.exports = params;