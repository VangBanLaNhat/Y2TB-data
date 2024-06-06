function init(){
    return{
        "pluginName": "Ping",
        "pluginMain": "pong.js",
        "desc": {
            "vi_VN": "Check độ trễ từ bot đến Facebook",
            "en_US": "Check latency from Bot to Facebook"
        },
        "commandList": {
            "ping": {
                "help": {
                    "vi_VN": "",
                    "en_US": ""
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
        "nodeDepends":{},
        "author": "HerokeyVN",
        "version": "0.0.2"
    }
}

function pong(data, api){
    const timeStart = Date.now();
    api.sendMessage("Pinging...", data.threadID, (e, a) => {
        if (api.editMessage) api.editMessage(`Ping: ${Date.now() - timeStart}ms`, a.messageID);
        else api.sendMessage(`Ping: ${Date.now() - timeStart}ms`, data.threadID, data.messageID)
    })
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