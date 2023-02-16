function init(){
    return{
        "pluginName": "Help",
        "pluginMain": "help.js",
        "desc": {
            "vi_VN": "Xem các lệnh hiện có ở Bot",
            "en_US": "View existing commands in Bot"
        },
        "commandList": {
            "help": {
                "help": {
                    "vi_VN": "[Lệnh] | [Số trang]",
                    "en_US": "[Command] | [Pages number]"
                },
                "tag": {
                    "vi_VN": "Xem các lệnh hiện có",
                    "en_US": "View existing commands"
                },
                "mainFunc": "main",
                "example": {
                    "vi_VN": "help",
                    "en_US": "help"
                }
            }
        },
        "langMap":{
            "listCommand":{
                "desc": "listCommand",
                "vi_VN": "Danh sách các lệnh:",
                "en_US": "List of commands:",
                "args": {}
            },
            "pages":{
                "desc": "Pages",
                "vi_VN": "Trang {0}/{1}",
                "en_US": "Page {0}/{1}",
                "args": {
                    "{0}":{
                        "vi_VN": "Trang hiện tại",
                        "en_US": "Current page"
                    },
                    "{1}":{
                        "vi_VN": "Tổng số trang",
                        "en_US": "Total pages"
                    }
                }
            },
            "listCommandEnd":{
                "desc": "listCommandEnd",
                "vi_VN": "Hãy gõ \"{prefix}help [Lệnh]\" để biết thêm chi tiết về lệnh đó",
                "en_US": "Type \"{prefix}help [Command]\" for more details about that command",
                "args": {
                    "{prefix}":{
                        "vi_VN": "Prefix",
                        "en_US": "Prefix"
                    }
                }
            },
            "commandInfo":{
                "desc": "Pages",
                "vi_VN": "Chi tiết lệnh:\n-Cách dùng:\n{0}\n-Mô tả: {1}\n\nChú thích:\n<>: Bắt buộc phải có\n[]: Không bắt buộc phải có",
                "en_US": "Command details:\n-Usage:\n{0}\n-Description: {1}\n\nNote:\n<>: Required\n[]: Not required",
                "args": {
                    "{0}":{
                        "vi_VN": "Cách dùng",
                        "en_US": "Use"
                    },
                    "{1}":{
                        "vi_VN": "Mô tả",
                        "en_US": "Description"
                    }
                }
            },
            "noCommand":{
                "desc": "No Command",
                "vi_VN": "Lệnh \"{0}\" không tồn tại!",
                "en_US": "The command \"{0}\" does not exist!",
                "args": {
                    "{0}":{
                        "vi_VN": "Lời nhắn",
                        "en_US": "Message"
                    }
                }
            }
        },
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}
function main(data, api){
    if(!Number(data.body) && data.body.length != 0){
        moreInfo(data, api);
    }
    else{
        help(data, api);
    }
}
function help(data, api){
    var cmNumber = 10;
    var msg;
    data.body ? msg = data.body : msg = 1;
    msg = Math.trunc(Number(msg));
    var listCommand = [];
    var listHelp = "";
    for (var x in global.plugins){
        for (var y in global.plugins[x].command){
            var dt = {
                "command": y,
                "help": global.plugins[x].command[y].help
            }
            listCommand.push(dt);
        }
    }
    var from = (msg * cmNumber)-cmNumber;
    var to = msg * cmNumber;
    var lang = global.config.bot_info.lang;
    
    
    for (var i = from; i < to; i++) {
        if(listCommand[i] != undefined){
            if (listCommand[i].help[lang] == undefined) {
                var helpCM = listCommand[i].help["en_US"];
            }else{
                var helpCM = listCommand[i].help[lang];
            }
            var cm = `${i+1}. ${global.config.facebook.prefix}${listCommand[i].command} ${helpCM}\n`
            listHelp += cm;
        }
    }
    if (listCommand.length % cmNumber != 0) {
        var crp = Math.trunc(listCommand.length / cmNumber)+1;
    }
    else{
        var crp = listCommand.length / cmNumber
    }
    
    var p = global.lang.Help.pages[global.config.bot_info.lang].replace("{0}", msg).replace("{1}", crp);
    
    var rt = global.lang.Help.listCommand[global.config.bot_info.lang]+"\n"+listHelp+`"${p}"`+"\n"+global.lang.Help.listCommandEnd[global.config.bot_info.lang].replace("{prefix}", global.config.facebook.prefix)
    
    api.sendMessage(rt , data.threadID, data.messageID);
}

function moreInfo(data, api){
    var rt = global.lang.Help.noCommand[global.config.bot_info.lang].replace("{0}", data.body);
    for (var i in global.plugins){
        if (global.plugins[i].command[data.body] != undefined){
            var use = `${global.config.facebook.prefix}${data.body} ${global.plugins[i].command[data.body].help[global.config.bot_info.lang]}`
            var rt = global.lang.Help.commandInfo[global.config.bot_info.lang].replace("{0}", use).replace("{1}", global.plugins[i].command[data.body].tag[global.config.bot_info.lang])
            break;
        }
    }
    api.sendMessage(rt , data.threadID, data.messageID);
}

module.exports = {
    main,
    init
}