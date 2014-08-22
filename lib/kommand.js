var net = require('net');
var util = require('util');
var events = require('events');

var Kommand=function(){
	var self=this;
	this.run=function (port, host, enable_mdns){			
		self.server = net.createServer(function(sock) {
			sock.on('data', function(data) {
				try{	
					var cmd=data.toString();
					//console.log(cmd);
					self.emit('data',cmd);
					sock.end();
				}catch(e){}
			});
			
			sock.on('close', function(had_error) {
				console.log('- socket closed, had_error? '+had_error);
			});
			
			sock.on('end', function() {
				console.log('- socket ended.');
			});
			
		}).listen(port, host);

		// advertise this open connection
		if(typeof enable_mdns=='undefined' || enable_mdns){
			var mdns = require('mdns');
			var ad = mdns.createAdvertisement(mdns.tcp('kommand'), port);
			ad.start();
		}
	}
}

util.inherits(Kommand, events.EventEmitter);

//console.log((new Date().toUTCString()) + ': Socket server listening on ' + HOST +':'+ PORT);

exports.instance=new Kommand;
