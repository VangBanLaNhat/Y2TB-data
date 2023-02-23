function init(){
    return{
        "pluginName": "ChatGPT",
        "pluginMain": "gpt.js",
        "desc": {
            "vi_VN": "Trò chuyện với ChatGPT",
            "en_US": "Chat with ChatGPT"
        },
        "commandList": {
            "gpt": {
                "help": {
                    "vi_VN": "",
                    "en_US": ""
                },
                "tag": {
                    "vi_VN": "Trò chuyện với ChatGPT",
                    "en_US": "Chat with ChatGPT"
                },
                "mainFunc": "main",
                "example": {
                    "vi_VN": "gpt hi",
                    "en_US": "gpt hi"
                }
            }
        },
        "nodeDepends":{
  
        },
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

async function main(data, api){
    const fetch = require("node-fetch");

    const Api = "https://beathanoi.com/openai?text="+encodeURI(data.body);
    console.log(data.body);
    
    let json = await fetch(Api);
    json = await json.json();
    
    api.sendMessage(json.openai, data.threadID, data.messageID);
}

module.exports = {
    main,
    init
};
