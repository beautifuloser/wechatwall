//生成xml返回微信服务器
var tmpl = require('tmpl');
function replyText(msg,replyText){
	var replyTmpl  = '<xml>' +
    '<ToUserName><![CDATA[{toUser}]]></ToUserName>' +
    '<FromUserName><![CDATA[{fromUser}]]></FromUserName>' +
    '<CreateTime><![CDATA[{time}]]></CreateTime>' +
    '<MsgType><![CDATA[{type}]]></MsgType>' +
    '<Content><![CDATA[{content}]]></Content>' +
    '</xml>'; 

    return tmpl(replyTmpl,{
    	toUser:msg.xml.FromUserName,
    	fromUser:msg.xml.ToUserName,
    	type:'text',
    	time:Date.now(),
    	content:replyText
    });
}


module.exports ={
	replyText : replyText
}