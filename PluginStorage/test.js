function init(){
    return{
        "pluginName": "test",
        "pluginMain": "test.js",
        "desc": {
            "vi_VN": "test",
            "en_US": "test"
        },
        "commandList": {
			"123": {
                "help": {
                    "vi_VN": "",
                    "en_US": ""
                },
                "tag": {
                    "vi_VN": "xD",
                    "en_US": "xD"
                },
                "mainFunc": "test"
            }
        },
        "nodeDepends": {
            "axios": ""
        },
        "author": "HyTommy",
        "version": "0.0.1"
    }
}
var test = async function(data, api){
    if(data.mentions == undefined) return api.sendMessage("hãy tag 1 người");
    if(data.body == data.mentions[Object.keys(data.mentions)[0]]) return api.sendMessage("nickname trống");
    api.changeNickname(data.body[0] == "@" ? data.body.slice(data.mentions[Object.keys(data.mentions)[0]].length - 1, data.body.length) : data.body.slice(0, data.body.indexOf(data.mentions[Object.keys(data.mentions)[0]])), data.threadID, Object.keys(data.mentions)[0])
}


module.exports = {
    test,
    init
}