/**
 * Generate a random number of characters with the given len
 *
 */
var RandomString = (function () {

	function RandomString() {
	}

	RandomString.chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

	RandomString.gen = function (len) {
		var uuid = new Array(len);
		var i = 0;
		while (i < len) {
			uuid[i] = RandomString.chars[0 | Math.random() * RandomString.chars.length];
			i++;
		}
		return uuid.join("");
	};

	return RandomString;

})();
