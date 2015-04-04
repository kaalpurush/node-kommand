var util = require('util');
var events = require('events');

var Kommand=function(){
	var self=this;
	var running=false;
	var tcp=false;
	
	this.use_tcp=function(){
		tcp=true;
	}
	
	this.isRunning=function(){
		return self.running;
	}
	
	this.run=function (port, host, enable_mdns){
		running=true;
		
		if(tcp){	
			var net = require('net');
			self.server = net.createServer(function(sock) {
				sock.on('data', function(data) {
					try{	
						var cmd=data.toString();
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
				
				sock.on('error', function(error) {
					console.log('- socket error: '+error);
				});
				
			}).listen(port, host);
			
			self.server.on('listening', function () {
				var address = self.server.address();
				console.log('kommand (tcp) listening on ' + address.address + ":" + address.port);
			});
			
			self.server.on('error', function (error) {	
				console.log('- server error: '+error);
				setTimeout(function () {
					self.server.close();
					self.server.listen(port, host);
				}, 10000);			
			});
		}
		else{
			var dgram = require('dgram');
			self.server = dgram.createSocket('udp4');

			self.server.on('listening', function () {
				var address = self.server.address();
				console.log('kommand (udp) listening on ' + address.address + ":" + address.port);
			});

			self.server.on('message', function (message, remote) {
				self.emit('data', message.toString());
			});
			
			self.server.on('close', function() {
					console.log('- socket closed.');
				});

			self.server.on('error', function(error) {
				console.log('- socket error: '+error);
			});

			self.server.bind(port, host);
		}

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
