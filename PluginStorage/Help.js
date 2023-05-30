function init(){
    return{
        "pluginName": "Ping",
        "pluginMain": "test.js",
        "desc": {
            "vi_VN": "Check độ trễ",
            "en_US": "Check latency"
        },
        "commandList": {
            "ping": {
                "help": {
                    "vi_VN": "[website]",
                    "en_US": "[website]"
                },
                "tag": {
                    "vi_VN": "Ping Pong",
                    "en_US": "Ping Pong"
                },
                "mainFunc": "pong",
                "example": {
                    "vi_VN": "ping",
                    "en_US": "ping"
                }
            }
        },
        "chathook": "pongch",
        "nodeDepends":{
        	"ping": ""
        },
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

async function pong(data, api){
	if(!data.args[1]){
	    const timeStart = Date.now();
	    api.sendMessage("Pinging...", data.threadID, () => api.sendMessage(`Ping: ${Date.now() - timeStart}ms`, data.threadID, data.messageID))
	}else{
		const ping = require("ping");
		
		var host = data.args[1];
		ping.sys.probe(host, function(isAlive){
	        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
	        console.log(msg);
	    });
		
	}
}

function pongch(data, api){
    if(data.body == "ping" || data.body == "Ping"){
        api.sendMessage("‍Pong" , data.threadID, data.messageID);
    } else if(data.body == "pong" || data.body == "Pong"){
        api.sendMessage("Amen, pong thì để tui nói, nói ping đê" , data.threadID, data.messageID);
    }
}

module.exports = {
    pong,
    pongch,
    init
};
