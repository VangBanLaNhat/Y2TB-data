function init(){
    global.data.connect = false;
    return{
        "pluginName": "Connected",
        "pluginMain": "Connected.js",
        "desc": {
            "vi_VN": "Tự đông phê duyệt",
            "en_US": "Auto-approval"
        },
        "commandList": {},
        "langMap":{
            "connect":{
                "desc": "Connected",
                "vi_VN": "{0} | Đã kết nối!\n",
                "en_US": "{0} | Connected!\n",
                "args": {
                    "{0}":{
                        "vi_VN": "Tên Bot",
                        "en_US": "Bot name"
                    }
                }
            },
            "help":{
                "desc": "help",
                "vi_VN": "Sử dụng lệnh \"{0}help [Trang||Lệnh]\" để xem tất cả các lệnh.",
                "en_US": "Use the command \"{0}help [Page||Commands]\" to see all commands.",
                "args": {
                    "{0}":{
                        "vi_VN": "Prefix",
                        "en_US": "Prefix"
                    }
                }
            }
        },
        "chathook": "connect", 
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

function connect(data, api){
    /*if (data.type == "event") {
        if (data.logMessageData.addedParticipants != undefined) {
            var botname = global.config.bot_info.botname;
            var prefix = global.config.facebook.prefix;
            var lang = global.lang.Connected.connect[global.config.bot_info.lang].replace("{0}", botname).replace("{1}", prefix);
            api.sendMessage(lang , data.threadID);
        }
    }*/
    if(!global.data.connect){
        global.data.connect = true;
        setInterval(function () {
            var lang = global.lang.Connected;
            var la = global.config.bot_info.lang;
            try{
            api.getThreadList(100, null, ["PENDING"], (e, l)=>{
                for(var i in l){
                    var rt = lang.connect[la].replace("{0}", global.config.bot_info.botname)
                    rt += lang.help[la].replace("{0}", global.config.facebook.prefix)
                    api.sendMessage(rt , l[i].threadID, (e)=>{
                        if(e){
                            api.deleteThread(l[i].threadID);
                            console.log("Connected", `Can't connected to ${l[i].threadID}!`)
                        }else console.log("Connected", `Connected to ${l[i].threadID} success!`)
                    });
                }
            })
            }catch(e){}
        }, 2*60*1000);
    }
}

module.exports = {
    connect,
    init
}