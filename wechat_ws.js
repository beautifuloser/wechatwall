var http = require('http');
var crypto = require('crypto');
var port = require('./lib/config').wxPort;
var url = require('url');
var qs = require('qs');
var token = require('./lib/config').token;
var xml2js = require('xml2js');
var replyText = require('./lib/reply').replyText;
var replyType = require('./lib/replyType').types;
var wss = require('./lib/ws').wss;
function checkSignature(params,token){
	//1.将token，timestamp，nonce三个参数进行字典序排序
	//2.将三个参数字符串接成一个字符串进行sha1加密
	//3.开发者活的加密后的字符串可与signature对比，标识该请求来源于微信
	var key = [token,params.timestamp,params.nonce].sort().join('');
	var sha1 = crypto.createHash('sha1');
	sha1.update(key);
	return sha1.digest('hex') == params.signature;
}


http.createServer(function(req,res){
	var query = url.parse(req.url).query;
	var params = qs.parse(query);

	if (!checkSignature(params,token)) {
	//验证失败
		res.end('signature fail');
	};
	if (req.method == "GET") {
		//get请求，返回params.echostr用于验证服务器有效性
		res.end(params.echostr);
	}else{
		//否则是微信服务器发送给开发者的post请求
		//接收消息
		var postdata = "";
		req.on('data',function(chunk){
			postdata += chunk;
		});

		req.on('end',function(){
			var parseString = xml2js.parseString;
			parseString(postdata,function (err,result){
				if (!err) {
					wss.broadcast(result);
					var resMessage = replyText(result,replyType[result.xml.MsgType[0]]);
					res.end(resMessage);
				};
			})
		})
	}

}).listen(port);
console.log('weixin server is running at %s',wxPort);