function init(){
    return{
        "pluginName": "Eval",
        "pluginMain": "Eval.js",
        "desc": {
            "vi_VN": "Chạy lệnh Javascrift",
            "en_US": "Run Javascript commands"
        },
        "commandList": {
            "eval": {
                "help": {
                    "vi_VN": "<Lệnh>",
                    "en_US": "<Command>"
                },
                "tag": {
                    "vi_VN": "Chạy lệnh Javascrift",
                    "en_US": "Run Javascript commands"
                },
                "mainFunc": "outeval",
                "example": {
                    "vi_VN": "eval new Date()",
                    "en_US": "eval new Date()"
                }
            }
        },
        "chathook": "outeval",
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

function outeval(data, api){
    if(data.type == "message" ||data.type == "message_reply"){
        if(data.body.indexOf(`${global.config.facebook.prefix}eval`) == 0){
            data.body = data.body.replace(`${global.config.facebook.prefix}eval`, "");
            var check = false;
            for (var i=0; i<global.config.facebook.admin.length; i++){
                if (global.config.facebook.admin[i]==data.senderID) {
                    check = true;
                }
            }
            if (check) {
                try{
                    var rt = eval(data.body);
                    if(typeof rt == "object"){
                        api.sendMessage(JSON.stringify(rt, null, 4), data.threadID, data.messageID);
                    } else {
                        api.sendMessage(rt+"", data.threadID, data.messageID);
                    }
                    console.log(rt)
                }catch(err){
                    console.log(err)
                    api.sendMessage(err.toString() , data.threadID, data.messageID);
                }
            }else{
                api.sendMessage("No permission!" , data.threadID, data.messageID);
            }
        }
    }
}


module.exports = {
    outeval,
    init
};