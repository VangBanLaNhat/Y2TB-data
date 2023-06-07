function init(){
    return{
        "pluginName": "Restart",
        "pluginMain": "restart.js",
        "desc": {
            "vi_VN": "Khởi động lại",
            "en_US": "Restart"
        },
        "commandList": {
            "autorestart": {
                "help": {
                    "vi_VN": "<Thời gian (phút)>",
                    "en_US": "<Time (minutes)>"
                },
                "tag": {
                    "vi_VN": "Chỉnh sửa thời gian tự động khởi động lại",
                    "en_US": "Edit auto-reboot time"
                },
                "mainFunc": "main",
                "example": {
                    "vi_VN": "autorestart 30",
                    "en_US": "autorestart 30"
                }
            },
            "restart": {
                "help": {
                    "vi_VN": "",
                    "en_US": ""
                },
                "tag": {
                    "vi_VN": "Khởi động lại",
                    "en_US": "Restart"
                },
                "mainFunc": "restart",
                "example": {
                    "vi_VN": "restart",
                    "en_US": "restart"
                }
            }
        },
        "onload": "onload",
        "loginFunc": "login",
        "nodeDepends":{},
        "author": "HerokeyVN",
        "version": "0.0.1",
        "langMap":{
            "reboot":{
                "desc": "Start reboot (Can't edit)",
                "vi_VN": "Bắt đầu khởi động lại!",
                "en_US": "Start Reboot!",
                "args": {}
            },
            "timeout":{
                "desc": "Notice of reboot time (Can't edit)",
                "vi_VN": "Sẽ khởi động lại sau {0} phút. Lưu ý:\n- Để chỉnh sửa thời gian tự động khởi động lại, dùng \"{1}\"\n- Thời gian khởi động lại bằng 0 sẽ tắt tính năng tự động khởi động lại",
                "en_US": "Will restart in {0} minutes.  Note:\n- To edit auto-reboot time, use \"{1}\"\n- Zero reboot time disables auto-reboot",
                "args": {
                    "{0}":{
                        "vi_VN": "Phút",
                        "en_US": "Minute"
                    },
                    "{1}":{
                    	"vi_VN": "Lệnh",
                        "en_US": "Command"
                    }
                }
            },
            "setting":{
            	"desc": "Edit reboot time",
                "vi_VN": "Đã chỉnh sửa thời gian tự động khởi động lại thành {0} phút. Cài đặt sẽ được áp dụng cho lần khởi động tiếp theo.",
                "en_US": "Edited auto-reboot time to {0} minutes. The setting will be applied to the next boot.",
                "args": {
                    "{0}":{
                        "vi_VN": "Phút",
                        "en_US": "Minute"
                    }
                }
            },
            "off":{
            	"desc": "Turn off auto restart",
                "vi_VN": "Đã tắt tự động khởi động lại. Cài đặt sẽ được áp dụng cho lần khởi động tiếp theo.",
                "en_US": "Disabled auto-reboot. The setting will be applied to the next boot.",
                "args": {}
            },
            "settingErr":{
            	"desc": "Invalid input",
                "vi_VN": "Thời gian tự động khởi động lại phải lớn hơn 5 phút!",
                "en_US": "Auto-restart time must be more than 5 minutes!",
                "args": {}
            },
            "noPermission":{
            	"desc": "No permission",
                "vi_VN": "Không đủ quyền",
                "en_US": "No permission",
                "args": {}
            },
            "restarted":{
            	"desc": "Reboot without problems",
                "vi_VN": "Đã khởi động lại!",
                "en_US": "Restarted!",
                "args": {}
            },
            "restartedErr":{
            	"desc": "Error with some plugins on reboot",
                "vi_VN": "Đã phát sinh lỗi với 1 số plugins khi khởi động lại: {0}",
                "en_US": "An error occurred with some plugins on reboot: {0}",
                "args": {
                	"{0}":{
                        "vi_VN": "Danh sách lỗi",
                        "en_US": "List error"
                    }
                }
            }
        }
    }
}

function onload(info){
    const config = 60;
    global.data.autorestart == undefined ? global.data.autorestart = config:"";
    //console.log(global.lang)
    let lang = info.langMap;
    let code = global.config.bot_info.lang;
    
    if(global.data.autorestart == 0) return;
    setTimeout(()=>{
    	console.warn(info.pluginName, lang.reboot[code]);
    	process.exit(7378278);
    }, global.data.autorestart*60*1000);
    let cmd = Object.keys(info.commandList)[0];
    console.warn(info.pluginName, lang.timeout[code].replaceAll("{0}", global.data.autorestart).replaceAll("{1}", global.config.facebook.prefix+cmd+" "+info.commandList[cmd].help[code]));
}

function main(data, api, adv){
    let {rlang, replaceMap} = adv;
    
    if(global.config.facebook.admin.indexOf(data.senderID) == -1) return api.sendMessage(rlang(noPermission), data.threadID, data.messageID);
    
    let time = Number(data.args[1]);
    if(time != 0 && time < 5) return api.sendMessage(rlang(settingErr), data.threadID, data.messageID);
    
    global.data.autorestart = time;
    
    if(time == 0) return api.sendMessage(rlang(off), data.threadID, data.messageID);
    
    let map = {
        "{0}": time
    }
    api.sendMessage(replaceMap(rlang(setting), map), data.threadID, data.messageID);
}

function restart(data, api, adv){
    let {rlang} = adv;
    
    if(global.config.facebook.admin.indexOf(data.senderID) == -1) return api.sendMessage(rlang(noPermission), data.threadID, data.messageID);
    global.data.restart = {
    	threadID: data.threadID,
    	senderID: data.senderID,
    	messageID: data.messageID
    }
    
    process.exit(7378278);
}

function login(api, adv){
	if(!global.data.restart) return;
	
	
    let {rlang, replaceMap} = adv;
    
	if(!global.temp.loadPlugin.stderr){
		console.log(rlang(restarted));
		api.sendMessage(rlang(restarted), global.data.restart.threadID, global.data.restart.messageID);
		return delete global.data.restart;
	}
	
	let str = "";
	
	for(let i of global.temp.loadPlugin.stderr)
		str += "\n\""+i.plugin+"\": "+i.error;
	
    //console.log(replaceMap(rlang(restartedErr), {"{0}": str}));
	api.sendMessage(replaceMap(rlang(restartedErr), {"{0}": str}), global.data.restart.threadID, global.data.restart.messageID);
	delete global.data.restart;
}

module.exports = {
    onload,
    main,
    restart,
    login,
    init
};
