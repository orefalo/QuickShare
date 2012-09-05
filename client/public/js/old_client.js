function canonicalize(url) {
	var div = document.createElement('div');
	div.innerHTML = "<a></a>";
	div.firstChild.href = url; // Ensures that the href is properly escaped
	div.innerHTML = div.innerHTML; // Run the current innerHTML back through the parser
	return div.firstChild;
}

function getHREF() {
	var parser = canonicalize(document.URL);
	return parser.protocol + "//" + parser.host;
}

function getHash() {
	var parser = canonicalize(document.URL);
	var hash = parser.pathname;
	if (hash.charAt(0) === '/') hash = hash.substring(1);
	return hash;
}


var fid = 0;
var files = {};
var downfiles = {};
var socket = io.connect('http://localhost');
//read the requested bytes
var reader, canHost;

if (typeof FileReader !== "undefined") {
	reader = new FileReader();
	canHost = true;
}
else {
	$('#clicky').html('<br /><br />Your browser is not modern enough to serve as a host. :( <br /><br />(Try Chrome or Firefox!)');
	canHost = false;
}
var chunksize = 32768;

socket.on('connect', function (data) {
	socket.emit('joiner', getHash());
});

socket.on('fileslist', function (data) {
	$('#fileslist').show();
	$('#clicky').html('');
	$('#clicky').hide();
	$('#fileslist').html('');
	$('#fileslist').html(function (i, v) {
		return '<table id="filestable" cellspacing="0" summary=""><tr><th scope="col" abbr="Filename" class="nobg" width="60%">Filename</th><th scope="col" abbr="Status" width="20%" >Size</th> <th scope="col" abbr="Size"width="20%" >Action</th></tr>' + v;
	});
	files = {};
	files = JSON.parse(data);
	for (var file in files) {
		console.log(file);
		if (files.hasOwnProperty(file)) {
			$('#filestable').append('<tr><th scope="row" class="spec">' + files[file][0] + '</th><td>' + files[file][1] + '</td><td class="end" ><div id="fidspan' + fid + '"></div><a href="" onclick="beginTransfer(\'' + files[file][0] + '\', ' + fid + ', ' + files[file][1] + '); return false;" id="fid' + fid + '">Transfer</a><a href="data:' + files[file][2] + ';base64," target="_blank" id="fidsave' + fid + '" style="display:none">Save to disk!</a></td></tr>');
			fid++;
		}

	}
});

socket.on('warn', function (data) {
	$('#warnings').html(data);
});

socket.on('host', function (data) {
	if (canHost) {
		$('#host').html("You're hosting this party!");
		$('#clicky').html("<br /><br /><br /><br />Click here to choose files");
		$('#fileslist').hide();
	}
});

socket.on('peer', function (data) {
	$('#peer').html("You're connected as a peer!");
	$('#host').html("Host connected.");
	$('#drop_zone').attr("onclick", function () {
		return;
	});
	$('#files').remove();
	$('#drop_zone').css("cursor", "default");
	$('#fileslist').hide();
	$('#clicky').html('Awaiting file list..');

});

socket.on('peerconnected', function (data) {
	$('#peer').html("Peer connected!");
});

socket.on('peerdisconnected', function (data) {
	$('#peer').html("Peer disconnected.");
});

socket.on('hostdisconnected', function (data) {
	$('#host').html("Host disconnected.");
	$('#peer').html("You're disconnected!");
});

socket.on('info', function (data) {
	$('#info').append(data);
});

socket.on('begintransfer', function (file, chunk) {
	if (chunk == 0) {
		$('#info').append("Beginning Transfer..");
	}

	fileholder = files[file];
	fileo = files[file][3]; //ugly

	start = chunk * chunksize;

	if ((parseInt(fileholder[1]) - 1) <= start + chunksize - 1) {
		stop = parseInt(fileholder[1]) - 1;
	}
	else {
		stop = start + chunksize - 1;
	}

	// If we use onloadend, we need to check the readyState.
	reader.onloadend = function (evt) {
		if (evt.target.readyState == FileReader.DONE) { // DONE == 2
			var data = evt.target.result;
			socket.emit('datatransfer', data, file, chunk);
		}
	};

	if (fileo.webkitSlice) {
		var blob = fileo.webkitSlice(start, stop + 1);
	} else if (fileo.mozSlice) {
		var blob = fileo.mozSlice(start, stop + 1);
	}
	else {
		alert("It won't work in your browser. Please use Chrome or Firefox.");
	}

	reader.readAsBinaryString(blob);

});

socket.on('datatransfer', function (data, file, chunk) {
	f = downfiles[file];
	f.data = f.data + data;
	if (f.chunks == chunk) {
		var fspan = "#fidspan" + f.fid;
		$(fspan).html('');
		$(fspan).hide();

		var fsave = "#fidsave" + f.fid;
		$(fsave).show();
		$(fsave).attr('href', $(fsave).attr('href') + encode64(f.data));
		$('#info').append("Transfer finished!");

	}
	else {
		var fspan = "#fidspan" + f.fid;
		$(fspan).html(Math.floor(((chunk / f.chunks) * 100)) + '%');
		var nextchunk = parseInt(chunk);
		socket.emit('begintransfer', file, nextchunk + 1);
	}
});

function beginTransfer(file, fid, size) {
	var f = "#fidspan" + fid;
	$(f).html('0%');
	f = "#fid" + fid;
	$(f).hide();

	var chunks = size / chunksize;
	if (chunks % 1 != 0) {
		chunks = Math.floor(chunks) + 1;
	}

	downfiles[file] = {data:'', chunk:0, chunks:chunks, fid:fid};
	socket.emit('begintransfer', file, 0);
}


function handleFileSelect() {

	var theFiles = $('#files')[0].files; // FileList object

	files = {};

	// Loop through the FileList and append unique files to list.
	for (var i = 0, f; f = theFiles[i]; i++) {
		if (!files.hasOwnProperty(f))
			files[f.name] = [f.name, f.size, f.type, f];
	}

	// notify peer
	socket.emit('listfiles', JSON.stringify(files));

	$('#fileslist').show();
	$('#clicky').html('');
	$('#clicky').hide();
	$('#fileslist').html('');
	$('#fileslist').html(function (i, v) {
		return '<table id="filestable" cellspacing="0" summary=""><tr><th scope="col" abbr="Filename" class="nobg" width="60%">Filename</th><th scope="col" abbr="Status" width="20%" >Size</th> <th scope="col" abbr="Size" width="20%" >Action</th></tr>' + v;
	});
	for (var file in files) {
		if (files.hasOwnProperty(file)) {
			$('#filestable').append('<tr><th scope="row" class="spec">' + files[file][0] + '</th><td>' + files[file][1] + '</td><td class="end">Sharing!</td></tr>');
		}

	}
}


function encode64(input) {

	var ENCODING = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	var output = "";
	var chr1, chr2, chr3 = "";
	var enc1, enc2, enc3, enc4 = "";
	var i = 0;

	do {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output = output +
			ENCODING.charAt(enc1) +
			ENCODING.charAt(enc2) +
			ENCODING.charAt(enc3) +
			ENCODING.charAt(enc4);
		chr1 = chr2 = chr3 = "";
		enc1 = enc2 = enc3 = enc4 = "";
	} while (i < input.length);

	return output;
}