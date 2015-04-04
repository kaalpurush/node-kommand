var config = require('./config');
var dgram = require('dgram');

var message = new Buffer('My KungFu is Good!');

var client = dgram.createSocket('udp4');
client.bind();
client.on("listening", function () {
	console.log('listening!');
    client.setBroadcast(true);
    client.send(message, 0, message.length, config.port, config.broadcast_address, function(err, bytes) {
		if (err) throw err;
		console.log('UDP message sent to ' + config.broadcast_address +':'+ config.port);
		client.close();
	});
});
