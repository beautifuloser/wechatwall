//一个简单的Websocket服务
var ws = require('ws');
var wsPort = require('./config').wsPort;

var WebSocketServer = ws.Server;//webSocketServer
var wss = new WebSocketServer({port:wsPort});

wss.on('connection',function connection(ws){
	ws.on('message',function incoming(message){
		console.log('received: %s', message);
	});
	console.log('new client connected.');
});


wss.broadcast = function broadcast(data){
	console.log(data);
	wss.clients.forEach(function each(client){
		client.send(JSON.stringify(data));
	});
}

module.exports ={
	wss:wss
};

console.log("Socket server runing at port: " + wsPort + ".");