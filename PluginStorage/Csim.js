async function csim(data, api){
    const fetch = require("node-fetch");
    const path = require("path");
    !global.data.csim?global.data.csim = {}:"";
    !global.data.csim[data.threadID]?global.data.csim[data.threadID] = false:"";
    
    var msg = data.body
    if(msg == "on"){
        global.data.csim[data.threadID] = true;
        api.sendMessage(global.lang.Csim.simOn[global.config.bot_info.lang] , data.threadID, data.messageID);
    }
    else if(msg == "off"){
        global.data.csim[data.threadID] = false;
        api.sendMessage(global.lang.Csim.simOff[global.config.bot_info.lang] , data.threadID, data.messageID);
    }
    else{
      //https://api-sv2.simsimi.net/v2/?text=${msg}&lc=${global.config.bot_info.lang.split("_")[0]}&cf=false
        var datajs = await fetch(encodeURI(`https://api-sv2.simsimi.net/v2/?text=${msg}&lc=${global.config.bot_info.lang.split("_")[1].toLowerCase()}&cf=false`));
        var json = await datajs.json();
        var s = json.success != "Sim doesn't know what you are talking about. Please teach me" ? json.success : msg;
        s = s != "I don't know what you're saying. Please teach me" ? s : msg;
        var rt = global.lang.Csim.simReturn[global.config.bot_info.lang].replace("{0}", s);
        if (s != undefined) {
            api.sendMessage(rt , data.threadID, data.messageID);
	    }
    }
}

async function chathook(data, api){
    !global.data.csim?global.data.csim = {}:"";
    if(data.type == "message" && global.data.csim[data.threadID] && data.body != `${global.config.facebook.prefix}csim off`){
        const fetch = require("node-fetch");
    
        var msg = data.body
        var datajs = await fetch(encodeURI(`https://api-sv2.simsimi.net/v2/?text=${msg}&lc=${global.config.bot_info.lang.split("_")[1].toLowerCase()}&cf=false`));
        var json = await datajs.json();
        var s = json.success != "Sim doesn't know what you are talking about. Please teach me" ? json.success : msg;
        s = s != "I don't know what you're saying. Please teach me" ? s : msg;
        var rt = global.lang.Csim.simReturn[global.config.bot_info.lang].replace("{0}", s);
        if (s != undefined) {
            api.sendMessage(rt , data.threadID, data.messageID);
	    }
    }
}

function init(){
    return{
        "pluginName": "Csim",
        "pluginMain": "Csim.js",
        "desc": {
            "vi_VN": "Trò chuyện với bạn Sim vui tính (AI)",
            "en_US": "Talk with Sim the funny A.I."
        },
        "commandList": {
            "csim": {
                "help": {
                    "vi_VN": "<Từ khóa>",
                    "en_US": "<Key word>"
                },
                "tag": {
                    "vi_VN": "Trò chuyện với Csim",
                    "en_US": "Talking with Csim"
                },
                "mainFunc": "csim",
                "example": {
                    "vi_VN": "csim bủk bủk lmao",
                    "en_US": "csim Hello"
                }
            }
        },
        "chathook": "chathook",
        "nodeDepends":{
            "node-fetch": ""
        },
        "langMap":{
            "simReturn":{
                "desc": "lang khi bot nhận lệnh csim",
                "vi_VN": "{0}",
                "en_US": "{0}",
                "args": {
                    "{0}": {
                        "vi_VN": "Lời sim nói",
                        "en_US": "Sim's speech"
                    }
                }
            },
            "simOn":{
                "desc": "lang khi bot nhận lệnh csim",
                "vi_VN": "Đã kích hoạt Csim ở đây!",
                "en_US": "Csim's on!",
                "args": {
                }
            },
            "simOff":{
                "desc": "lang khi bot nhận lệnh csim",
                "vi_VN": "Đã tắt Csim ở đây!",
                "en_US": "Csim's off!",
                "args": {
                }
            }
        },
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

module.exports = {
    csim,
    chathook,
    init
};