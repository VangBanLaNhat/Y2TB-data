function init(){
    return{
        "pluginName": "AntiUnsend",
        "pluginMain": "AntiUnsend.js",
        "desc": {
            "vi_VN": "Khôi phục tin nhắn khi bị gỡ",
            "en_US": "Resend messages when deleted"
        },
        "commandList": {
            "antiunsend": {
                "help": {
                    "vi_VN": "",
                    "en_US": ""
                },
                "tag": {
                    "vi_VN": "Bật/Tắt AntiUnsend",
                    "en_US": "On/Off AntiUnsend"
                },
                "example": {
                    "vi_VN": "antiunsend",
                    "en_US": "antiunsend"
                },
                "mainFunc": "start"
            }
        },
        "chathook": "uns",
        "langMap":{
            "send":{
                "desc": "unsend",
                "vi_VN": "Kích hoạt AntiUnsend. {0} đã gỡ 1 tin nhắn.\n{1}{2}",
                "en_US": "Enable AntiUnsend. {0} removed 1 message.{1}{2}",
                "args": {
                    "{0}": {
                        "vi_VN": "Tên",
                        "en_US": "Name"
                    },
                    "{1}": {
                        "vi_VN": "Nội dung",
                        "en_US": "Body"
                    },
                    "{2}": {
                        "vi_VN": "Tệp",
                        "en_US": "File"
                    }
                }
            },
            "on":{
                "desc": "On AntiUnsend",
                "vi_VN": "Đã bật AntiUnsend ở thread này với quyền {0}",
                "en_US": "Enabled AntiUnsend in this thread with {0} rights",
                "args": {
                    "{0}": {
                        "vi_VN": "Quyền",
                        "en_US": "Permission"
                    }
                }
            },
            "off":{
                "desc": "On AntiUnsend",
                "vi_VN": "Đã tắt AntiUnsend ở thread này với quyền {0}",
                "en_US": "Disabled AntiUnsend in this thread with {0} rights",
                "args": {
                    "{0}": {
                        "vi_VN": "Quyền",
                        "en_US": "Permission"
                    }
                }
            },
            "noad":{
                "desc": "No permission",

                "vi_VN": "Bạn không đủ quyền!",
                "en_US": "You are not authorized!",
                "args": {}
            }
        },
        "nodeDepends":{
            "tinyurl": ""
        },
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

async function start(data, api, adv){
    var lang = global.lang.AntiUnsend;
    var l = global.config.bot_info.lang;
    try{
        var grinfo = await adv.getThreadInfo(data.threadID);
        var listadgr = [];
        for (var i=0; i<grinfo.adminIDs.length; i++){
            listadgr.push(grinfo.adminIDs[i].id);
        }
    } catch (err) {
        var listadgr = []
        console.error("AntiUnsend", err)
    }
    var rt = lang.noad[l];
    if (listadgr.indexOf(data.senderID) != -1) {
        if (global.data.antiunsend[data.threadID]) {
            global.data.antiunsend[data.threadID] = false;
            rt = lang.off[l].replace("{0}", "Admin group")
        } else {
            global.data.antiunsend[data.threadID] = true;

            rt = lang.on[l].replace("{0}", "Admin group")
        }
    } else if (global.config.facebook.admin.indexOf(data.senderID) != -1) {
        if (global.data.antiunsend[data.threadID]) {
            global.data.antiunsend[data.threadID] = false;
            rt = lang.off[l].replace("{0}", "Admin BotChat")
        } else {
            global.data.antiunsend[data.threadID] = true;

            rt = lang.on[l].replace("{0}", "Admin BotChat")
        }
    }
    api.sendMessage(rt , data.threadID, data.messageID);
}

function uns(data, api, adv){
    !global.aus ? global.aus = {}:"";
    !global.data.antiunsend ? global.data.antiunsend = {}:"";
    global.data.antiunsend[data.threadID] == undefined ? global.data.antiunsend[data.threadID] = true:"";
    switch (data.type) {
        case 'message_reply':
        case 'message':
            if(data.senderID != undefined && data.senderID != api.getCurrentUserID()) read(data, api)
            break;
        case "message_unsend":
            
            if(global.data.antiunsend[data.threadID] && global.aus[data.messageID] != undefined) send(data, api);
            break
    }
}

function read(data){
    var atmurl = [];
    if (data.attachments.length > 0){
        for (var i=0; i<data.attachments.length; i++){
            atmurl.push(data.attachments[i].url);
        };
    }
    global.aus[data.messageID] = {
        body: data.body,
        attachments: atmurl
    }

}

async function send(data, api, adv){
    var shot = require('tinyurl');
    
    var lang = global.lang.AntiUnsend.send[global.config.bot_info.lang];
    var msgid = data.messageID;
    var dt = JSON.parse(JSON.stringify(global.aus[msgid]));
    delete global.aus[data.messageID];
    var uinfo = await adv.getUserInfo(data.senderID);
    var nameuser = uinfo[data.senderID].name;
    lang = lang.replace("{0}", nameuser);
    if (dt.body != "") {
        if (global.config.bot_info.lang == "vi_VN") lang = lang.replace("{1}", `-Nội dung: ${dt.body}\n`)
        else lang = lang.replace("{1}", `-Content: ${dt.body}\n`)
    } else {lang = lang.replace("{1}", ``)}
    if (dt.attachments.length >0){
        var list = "";
        for (var i=0; i<dt.attachments.length; i++){
            var sl = await shot.shorten(dt.attachments[i]);
            list += `${i+1}. ${sl}\n`
        };
        if (global.config.bot_info.lang == "vi_VN") lang = lang.replace("{2}", `-Tệp:\n${list}`)
        else lang = lang.replace("{2}", `-File:\n${list}`)
    } else {lang = lang.replace("{2}", ``)};
    
    api.sendMessage(lang , data.threadID);
}

module.exports = {
    start,
    uns,
    init
}
