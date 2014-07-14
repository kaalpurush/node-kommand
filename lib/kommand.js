var net = require('net');
var util = require('util');
var mdns = require('mdns');
var events = require('events');

var Kommand=function(){
	var self=this;
	this.run=function (port, host){
		net.createServer(function(sock) {
			sock.on('data', function(data) {
				try{	
					var cmd=data.toString();
					//console.log(cmd);
					self.emit('data',cmd);
				}catch(e){}
			});
			
			sock.on('close', function(data) {
				//console.log((new Date().toUTCString()) + ' disconnected.');
			});
			
		}).listen(port, host);

		// advertise this open connection
		var ad = mdns.createAdvertisement(mdns.tcp('kommand'), port);
		ad.start();
	}
}

util.inherits(Kommand, events.EventEmitter);


//console.log((new Date().toUTCString()) + ': Socket server listening on ' + HOST +':'+ PORT);

exports.instance=new Kommand;
