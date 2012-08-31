var socketio = require('socket.io');

/**
 * We register master and slave in the same room,
 * at index 0 is the master
 * we ensure only one slave (at index 1)
 *
 */
module.exports = function (server) {

	var io = socketio.listen(server);

	/**
	 * Joins master/slave in the room named by the given hash
	 *
	 * @param socket either a master or slave msg
	 * @param hash name of the room (non empty, 16 chars)
	 * @param file file details to share or empty for slave
	 */
	function join(socket, hash, file) {

		// List of clients in a particular room
		var roomClients = io.sockets.clients(hash);
		var clientsInRoom = roomClients.length;

		console.log("clients in room=" + clientsInRoom);

		var isRoomEmpty = (
			clientsInRoom === 0 || typeof clientsInRoom === "undefined"
			);


		if (isRoomEmpty) {

			if (file) {

				// At this point the socket is a Master
				console.log("master");
				socket.join(hash);
				socket.set('file', file);

			} else {

				// ERROR: We are a Slave, but there is no master!
				socket.emit('error', 503, "There is no master at this location");
			}
			return;
		}
		else if (clientsInRoom > 1) {

			// If we have more than one slave in the room, kick them out!
			console.log("Exit other slaves");

			for (var i = 1; i < clientsInRoom; i++)
				roomClients[i].leave(hash);

		}

		// At this point the socket is a Slave
		console.log("I am the Slave");

		socket.join(hash);

		var master = roomClients[0];
		socket.master = master;
		master.slave = socket;

		master.get('file', function (err, file) {

			// Tell the master to start the transfer
			socket.emit("start", file);
		});

	}


	io.sockets.on('connection', function (socket) {
		console.log("connect");

		socket.on('disconnect', function (socket) {

			// Figure who is disconnecting
			console.log("disconnect");


			if (socket.master) {
				console.log("emit master");
				socket.master.emit('error', 101, "Slave disconnected");
			}
			else {
				console.log("emit slave");
				if (socket.slave)
					socket.slave.emit('error', 101, "Master disconnected");
			}

		});

		/**
		 * master and slave raise this event, the slave however has file empty
		 *
		 */
		socket.on('ready', function (hash, fileName, fileType, fileSize) {

			console.log("ready " + hash + " " + fileName + " " + fileType + " " + fileSize);

			var len = hash.length;
			// no room id (hash), just ignore the request
			if (len === 16) {

				var file;
				if (fileName)
					file = {name:fileName, type:fileType, size:fileSize};

				join(socket, hash, file);
			}
		});

		/**
		 * SLAVE to MASTER
		 */
		socket.on('done', function () {
			socket.master.emit('done');
		});

		socket.on('getChunk', function (chunkIndex) {
			console.log("<- getChunk chunkIndex:" + chunkIndex);
			socket.master.emit('getChunk', chunkIndex);
		});

		/**
		 * MASTER to SLAVE
		 */

		socket.on('sendChunk', function (chunkIndex, chunk) {
			console.log("-> sendChunk chunkIndex:" + chunkIndex);
			socket.slave.emit('sendChunk', chunkIndex, chunk);
		});


	});
};

