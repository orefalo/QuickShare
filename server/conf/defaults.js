module.exports = {
	port:3000,
	fontend_server:"localhost",

	extend:function (obj) {
		for (var i in obj)
			// make sure it's not an inherited property
			if (obj.hasOwnProperty(i))
				this[i] = obj[i];
	}

};
