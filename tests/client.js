var config = require('./config');
var dgram = require('dgram');

var message = new Buffer(process.argv[2]);

var client = dgram.createSocket('udp4');
client.bind();
client.on("listening", function () {
	console.log('listening!');
    client.setBroadcast(true);
    client.send(message, 0, message.length, config.port, config.broadcast_address, function(err, bytes) {
		if (err) throw err;
		console.log('UDP message `'+process.argv[2]+'` sent to ' + config.broadcast_address +':'+ config.port);
		client.close();
	});
});
