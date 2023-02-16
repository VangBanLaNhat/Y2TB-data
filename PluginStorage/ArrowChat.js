!global.data.arrowchat ? global.data.arrowchat = {}:"";
function init(){
    return{
        "pluginName": "ArrowChat",
        "pluginMain": "ArrowChat.js",
        "desc": {
            "vi_VN": "Trả lời tự động khi xuất hiện từ mà người dùng có thể cài đặt sẵn",
            "en_US": "Auto-reply when a user-preset word appears"
        },
        "commandList": {
            "adrow": {
                "help": {
                    "vi_VN": "<Từ khóa> => <Trả lời>",
                    "en_US": "<Keyword> => <Answer>"
                },
                "tag": {
                    "vi_VN": "",
                    "en_US": ""
                },
                "mainFunc": "add",
                "example": {
                    "vi_VN": "adrow chào eim=>anh đứng đây từ chiều",
                    "en_US": "adrow ping=>pong"
                }
            },
            "listrow": {
                "help": {
                    "vi_VN": "",
                    "en_US": ""
                },
                "tag": {
                    "vi_VN": "",
                    "en_US": ""
                },
                "mainFunc": "list",
                "example": {
                    "vi_VN": "listrow",
                    "en_US": "listrow"
                }
            },
            "delarow": {
                "help": {
                    "vi_VN": "<Từ khóa>",
                    "en_US": "<Keyword>"
                },
                "tag": {
                    "vi_VN": "",
                    "en_US": ""
                },
                "mainFunc": "del",
                "example": {
                    "vi_VN": "delarow chào eim",
                    "en_US": "delarow ping"
                }
            },
            "delarowall": {
                "help": {
                    "vi_VN": "",
                    "en_US": ""
                },
                "tag": {
                    "vi_VN": "",
                    "en_US": ""
                },
                "mainFunc": "delall",
                "example": {
                    "vi_VN": "delarowall",
                    "en_US": "delarowall"
                }
            }
        },
        "chathook": "chathook",
        "nodeDepends":{},
        "langMap":{
            "addf":{
                "desc": "Không đúng cú pháp",
                "vi_VN": " Cú pháp không đúng.\n-Để thêm từ khóa vào danh sách ArrowChat, bạn hãy gõ \"{0}adrow <Từ khóa> => <Trả lời>\".\n-Để thêm nhiều câu trả lời hãy gõ \"{0}adrow <Từ khóa> => <Trả lời 1>|<Trả lời 2>|...\".\n-Để xem danh sách ArrowChat, bạn hãy gõ \"{0}listrow\".\n-Để xóa 1 từ khỏi danh sách ArrowChat, bạn hãy gõ \"{0}delarow <Từ khóa>\".",
                "en_US": "The syntax is incorrect.\n-To add a keyword to the ArrowChat list, type \"{0}adrow <Keyword> => <Answer>\".\n-To add multiple replies type \"{0}adrow <Keyword  > => <Answer 1>|<Answer 2>|...\".\n-To view the ArrowChat list, type \"{0}listrow\".\n-To remove a word from the list, type \"{0}listrow\".\n  ArrowChat, type \"{0}delarow <Keyword>\".",
                "args": {
                    "{0}": {
                        "vi_VN": "Prefix",
                        "en_US": "Prefix"
                    }
                }
            },
            "addt":{
                "desc": "Thêm hoàn tất",
                "vi_VN": "Đã thêm vào danh sách ArrowChat.\n-Nói: {0}\n-Trả lời: {1}",
                "en_US": "Added to ArrowChat list.\n-Ask: {0}\n-Answer: {1}",
                "args": {
                    "{0}": {
                        "vi_VN": "Nói",
                        "en_US": "Ask"
                    },
                    "{1}": {
                        "vi_VN": "Trả lời",
                        "en_US": "Answer"
                    },
                }
            },
            "list":{
                "desc": "Danh sách keyword",
                "vi_VN": "Danh sách ArrowChat:\n{0}",
                "en_US": "ArrowChat List:\n{0}",
                "args": {
                    "{0}": {
                        "vi_VN": "Danh sách",
                        "en_US": "List"
                    }
                }
            },
            "ndt":{
                "desc": "Thread not found",
                "vi_VN": "Không có dữ liệu!",
                "en_US": "No data!",
                "args": {}
            },
            "nmsg":{
                "desc": "Không có args",
                "vi_VN": "Vui lòng nhập từ khóa!",
                "en_US": "Please enter keywords!",
                "args": {}
            },
            "delf":{
                "desc": "Không thể xóa",
                "vi_VN": "Từ khóa không tồn tại!",
                "en_US": "Keyword does not exist!",
                "args": {}
            },
            "delt": {
                "desc": "Đã xóa",
                "vi_VN": "Đã xóa từ khóa \"{0}\" khỏi danh sách ArrowChat!",
                "en_US": "Removed keyword \"{0}\" from ArrowChat list!",
                "args": {
                    "{0}": {
                        "vi_VN": "Từ khóa",
                        "en_US": "Keyword"
                    }
                }
            },
            "delall": {
                "desc": "Đã xóa",
                "vi_VN": "Đã xóa toàn bộ danh sách ArrowChat ở đây với quyền {0}!",
                "en_US": "Deleted the entire ArrowChat list here with {0} rights!",
                "args": {
                    "{0}": {
                        "vi_VN": "quyền",
                        "en_US": "permission"
                    }
                }
            },
            "noad": {
                "desc": "Không đủ quyền",
                "vi_VN": "Không đủ quyền!",
                "en_US": "No permission!",
                "args": {}
            }
        },
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

function add(data, api){
    !global.data.arrowchat[data.threadID] ? global.data.arrowchat[data.threadID] = {}:"";
    
    var lang = global.lang.ArrowChat;
    var l = global.config.bot_info.lang;
    
    var msg = data.body
    var ask = msg ? msg.split("=>")[0].trim().toLowerCase() : false;
    var ans = msg ? msg.split("=>")[1].trim() : false;
    if (ask && ans){
        !global.data.arrowchat[data.threadID][ask] ? global.data.arrowchat[data.threadID][ask] = []:"";
        var ansa = ans.split("|");
        console.log(ansa);
        for (var i of ansa) {
            global.data.arrowchat[data.threadID][ask].push(i);
        }
        api.sendMessage(lang.addt[l].replace("{0}", ask).replace("{1}", JSON.stringify(global.data.arrowchat[data.threadID][ask])), data.threadID, data.messageID);
    }else api.sendMessage(replaceAll(lang.addf[l], "{0}", global.config.facebook.prefix), data.threadID, data.messageID);
}

function list(data, api){
    var lang = global.lang.ArrowChat;
    var l = global.config.bot_info.lang;
    if(global.data.arrowchat[data.threadID]){
        
        
        var list="";
        
        var nb = 0;
        for (var arg in global.data.arrowchat[data.threadID]) {
            var listask="";
            if (global.data.arrowchat[data.threadID][arg].length == 1) listask = global.data.arrowchat[data.threadID][arg][0]
            else for(var answ of global.data.arrowchat[data.threadID][arg]){
                listask += answ;
                if (global.data.arrowchat[data.threadID][arg].indexOf(answ) != global.data.arrowchat[data.threadID][arg].length-1) listask += ", "
                else listask +=".";
            }
            nb += 1;
            list += `${nb}. ${arg}: ${listask}\n`;
        }
        api.sendMessage(lang.list[l].replace("{0}", list), data.threadID, data.messageID);
    } else api.sendMessage(lang.ndt[l], data.threadID, data.messageID);
}

function del (data, api){
    var lang = global.lang.ArrowChat;
    var l = global.config.bot_info.lang;
    if(global.data.arrowchat[data.threadID]){
        var msg = data.body.toLowerCase();
        if (msg) {
            if (global.data.arrowchat[data.threadID][msg]){
                delete global.data.arrowchat[data.threadID][msg];
                api.sendMessage(lang.delt[l].replace("{0}", msg), data.threadID, data.messageID);
                if (Object.keys(global.data.arrowchat[data.threadID]).length == 0) delete global.data.arrowchat[data.threadID]
            }else api.sendMessage(lang.delf[l], data.threadID, data.messageID);
        } else api.sendMessage(lang.nmsg[l], data.threadID, data.messageID);
    }else api.sendMessage(lang.ndt[l], data.threadID, data.messageID);
}

async function delall (data, api){
    var lang = global.lang.ArrowChat;
    var l = global.config.bot_info.lang;
    if(global.data.arrowchat[data.threadID]){
        try{
            var grinfo = await api.getThreadInfo(data.threadID);
            var listadgr = [];
            for (var i=0; i<grinfo.adminIDs.length; i++){
                listadgr.push(grinfo.adminIDs[i].id);
            }
        } catch (err) {
            var listadgr = []
            console.error("ArrowChat", err)
        }
        if (listadgr.indexOf(data.senderID) != -1) {
            delete global.data.arrowchat[data.threadID];
            api.sendMessage(lang.delall[l].replace("{0}", "Admin group"), data.threadID, data.messageID);
        } else if (global.config.facebook.admin.indexOf(data.senderID) != -1) {
            delete global.data.arrowchat[data.threadID];
            api.sendMessage(lang.delall[l].replace("{0}", "Admin BotChat"), data.threadID, data.messageID);
        } else api.sendMessage(lang.noad[l], data.threadID, data.messageID);
    }else api.sendMessage(lang.ndt[l], data.threadID, data.messageID);
}

function chathook (data, api){
    if(data.senderID != global.botid && (data.type == "message" || "message_reply") && data.body && global.data.arrowchat[data.threadID] && global.data.arrowchat[data.threadID][data.body.toLowerCase()]){
        var nb = random(0, global.data.arrowchat[data.threadID][data.body.toLowerCase()].length)
        var rt = global.data.arrowchat[data.threadID][data.body.toLowerCase()][nb];
        api.sendMessage("‍‍‍‍‍‍‍‍‍‍"+rt, data.threadID, data.messageID);
    }
}

function replaceAll(string, arg, repl) {
    while(string.indexOf(arg) != -1){
        string = string.replace(arg, repl);
    }
    return string;
}

function random(min, max){
    var l1 = Math.floor(Math.random() * max) + min;
    var l2 = Math.floor(Math.random() * max) + min;
    var rd = Math.floor(Math.random() * 1) + 0;
    if (rd == 0) return l1
    else return l2;
}

module.exports = {
    init,
    add,
    list,
    del,
    delall,
    chathook
}