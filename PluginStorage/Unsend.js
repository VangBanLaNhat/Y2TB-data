function init(){
    return{
        "pluginName": "Unsend",
        "pluginMain": "Unsend.js",
        "desc": {
            "vi_VN": "Gỡ tin nhắn của Bot",
            "en_US": "Remove Bot's messages"
        },
        "commandList": {
            "unsend": {
                "help": {
                    "vi_VN": "<Trả lời>",
                    "en_US": "<Reply>"
                },
                "tag": {
                    "vi_VN": "Gỡ tin nhắn",
                    "en_US": "Unsend messages"
                },
                "mainFunc": "main",
                "example": {
                    "vi_VN": "unsend",
                    "en_US": "unsend"
                }
            }
        },
        "langMap":{
            "cl":{
                "desc": "Completed",
                "vi_VN": "Đã gỡ tin nhắn với quyền {0}",
                "en_US": "Unsend the message with {0} rights",
                "args": {
                    "{0}": {
                        "vi_VN": "Quyền",
                        "en_US": "Permission"
                    }
                }
            },
            "nmsg":{
                "desc": "No message reply",
                "vi_VN": "Vui lòng reply tin nhắn cần gỡ!",
                "en_US": "Please reply to the message that needs to be removed!",
                "args": {}
            },
            "umm":{
                "desc": "It isn't my message",
                "vi_VN": "Không thể gỡ tin nhắn của người khác!",
                "en_US": "Can't remove other people's messages!",
                "args": {}
            },
            "noad":{
                "desc": "No permission",
                "vi_VN": "Bạn không đủ quyền!",
                "en_US": "You are not authorized!",
                "args": {}
            }
        },
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

async function main(data, api) {
    var lang = global.lang.Unsend;
    var l = global.config.bot_info.lang;
    if (data.messageReply){
        try{
            var grinfo = await api.getThreadInfo(data.threadID);
            var listadgr = [];
            for (var i=0; i<grinfo.adminIDs.length; i++){
                listadgr.push(grinfo.adminIDs[i].id);
            }
        } catch (err) {
            var listadgr = []
            console.error("Unsend", err)
        }
        if (listadgr.indexOf(data.senderID) != -1) {
            api.unsendMessage(data.messageReply.messageID, (e)=>{
                if(e) api.sendMessage(lang.umm[l], data.threadID, data.messageID)
                else api.sendMessage(lang.cl[l].replace("{0}", "Admin group"), data.threadID, data.messageID);
            })
        } else if (global.config.facebook.admin.indexOf(data.senderID) != -1) {
            api.unsendMessage(data.messageReply.messageID, (e)=>{
                if(e) api.sendMessage(lang.umm[l], data.threadID, data.messageID);
                else api.sendMessage(lang.cl[l].replace("{0}", "Admin BotChat"), data.threadID, data.messageID);
            })
        } else api.sendMessage(lang.noad[l], data.threadID, data.messageID);
    } else api.sendMessage(lang.nmsg[l], data.threadID, data.messageID);
}

module.exports = {
    init,
    main
}