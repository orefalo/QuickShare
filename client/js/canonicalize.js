/**
 * parser = canonicalize("http://example.com:3000/pathname/?search=test#hash");
 *
 * parser.protocol; // => "http:"
 * parser.hostname; // => "example.com"
 * parser.port;     // => "3000"
 * parser.pathname; // => "/pathname/"
 * parser.search;   // => "?search=test"
 * parser.hash;     // => "#hash"
 * parser.host;     // => "example.com:3000"
 * this code works on IE6 - http://www.joezimjs.com/javascript/the-lazy-mans-url-parsing/
 **/
function canonicalize(url) {
	var div = document.createElement('div');
	div.innerHTML = "<a></a>";
	div.firstChild.href = url; // Ensures that the href is properly escaped
	div.innerHTML = div.innerHTML; // Run the current innerHTML back through the parser
	return div.firstChild;
}