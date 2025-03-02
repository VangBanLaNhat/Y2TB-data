function init(){
    return{
        "pluginName": "Connected",
        "pluginMain": "Connected.js",
        "desc": {
            "vi_VN": "Tự đông phê duyệt",
            "en_US": "Auto-approval"
        },
        "commandList": {
        	"pending": {
				"help": { 
                    "vi_VN": "", 
                    "en_US": "" 
                }, 
                "tag": { 
                    "vi_VN": "Xem danh sách các nhóm trong danh sách chờ phê duyệt", 
                    "en_US": "See the list of groups on the approval waiting list" 
                }, 
                "example": { 
                    "vi_VN": "pending", 
                    "en_US": "pending" 
                }, 
                "mainFunc": "pending"
        	}
        },
        "langMap":{
        	"inbox":{
        		"desc": "Inbox only",
                "vi_VN": "Chỉ hoạt động trong tin nhắn riêng!",
                "en_US": "Inbox only!",
                "args": {}
        	},
        	"noPer":{
        		"desc": "No permission",
                "vi_VN": "Không đủ quyền!",
                "en_US": "No permission!",
                "args": {}
        	},
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
            },
            "listPending":{
                "desc": "List pending",
                "vi_VN": "Các nhóm hiện có trong danh sách chờ:{list}\n- Reply tin nhắn này và nhập danh sách số thứ tự nhóm muốn phê duyệt\n* Ví dụ: 1 3 4 5\n- Reply và nhập \"all\" để phê duyệt toàn bộ\n* Lưu ý: Các nhóm hoặc người dùng không được phê duyệt sẽ tự động rời khỏi nhóm và xóa cuộc trò chuyện!",
                "en_US": "Existing groups in the waiting list: {list} \n- Reply this message and enter the list of the order number you want to approve \n* Example: 1 3 4 5 \n- Reply and enter \"all \"To approve the whole \n* Note: The untreated groups or users will automatically leave the group and delete the conversation!",
                "args": {
                    "{list}":{
                        "vi_VN": "Danh sách các nhóm đợi phê duyệt",
                        "en_US": "List of groups waiting for approval"
                    }
                }
            },
            "listDone":{
                "desc": "List Done",
                "vi_VN": "Hoàn tất phê duyệt các nhóm: {list}",
                "en_US": "Complete the group approval: {list}",
                "args": {
                    "{list}":{
                        "vi_VN": "Danh sách các nhóm đã phê duyệt",
                        "en_US": "List of approved groups"
                    }
                }
            },
            "listOut":{
                "desc": "List Out",
                "vi_VN": "Đã hủy phê duyệt đối với các nhóm: {list}",
                "en_US": "Cancel approval to groups: {list}",
                "args": {
                    "{list}":{
                        "vi_VN": "Danh sách các nhóm đã hủy phê duyệt",
                        "en_US": "List of cancellated groups"
                    }
                }
            }
        },
        config: {
            auto_connect: false,
            time_auto_connect: 5
        },
        "loginFunc": "connect", 
        "chathook": "chathook",
        "author": "HerokeyVN",
        "version": "1.0.1"
    }
}

function pending(data, api, adv){
	const {pluginName, rlang} = adv;
	//if(data.isGroup) return api.sendMessage(rlang("inbox"), data.threadID, data.messageID);
	if(global.config.facebook.admin.indexOf(data.senderID) == -1) return api.sendMessage(rlang("noPer"), data.threadID, data.messageID);
    !global.temp.threadPending ? global.temp.threadPending = {}:"";
    if(global.temp.threadPending.MID) {
        api.unsendMessage(global.temp.threadPending.MID);
        global.temp.threadPending = {};
    }
	
	api.getThreadList(100, null, ["OTHER"], (error_orther, orther)=>{
        api.getThreadList(100, null, ["PENDING"], (error_pending, pending)=>{
            if(error_orther || error_pending){
                console.error(pluginName, error_orther+"\n"+error_pending);
                return api.sendMessage(error_orther+"\n"+error_pending, data.threadID, data.messageID)
            }
            
            global.temp.threadPending = {
                UID: data.senderID,
                list: orther.concat(pending)
            };
            send(data, api, adv);
        });
	});
}

function send(data, api, adv){
	let {rlang, replaceMap} = adv;
    let listStr = "";
    for(let i in global.temp.threadPending.list){
        console.log(global.temp.threadPending.list[i]);
        listStr += "\n"+(Number(i)+1)+". "+global.temp.threadPending.list[i].name
    }
    
    let map = {
        "{list}": listStr
    };
	
	api.sendMessage(replaceMap(rlang("listPending"), map), data.threadID, (e, a)=>{
        if(e) return console.error("Connection", e);
        global.temp.threadPending.MID = a.messageID;
    }, data.messageID);
}

function chathook(data, api, adv){
    if(data.type != "message_reply" || !global.temp.threadPending || !global.temp.threadPending.MID) return;
    if(data.messageReply.messageID != global.temp.threadPending.MID) return;

    const {rlang} = adv;
    let msg = (data.body.split(" ")); msg[0] = msg[0].toLowerCase();
    console.log(msg[0]);
    let rt = rlang("connect").replaceAll("{0}", global.config.bot_info.botname) + rlang("help").replaceAll("{0}", global.config.facebook.prefix);
    let done = [];
    let out = [];

    if(msg[0] == "all"){
        for(let i of global.temp.threadPending.list){
            api.sendMessage(rt, i.threadID, (e)=>{
                if(e){
                    api.deleteThread(i.threadID).catch(error => {
                        console.error(error.message);
                    });
                    console.error("Connected", `Can't connected to ${i.threadID} with error: ${e}`)
                } else {
                    console.log("Connected", `Connected to ${i.threadID} success!`);
                }
            }).catch(error => {
                console.error(error.message);
            });
            
            done.push(i.name);
        }
    } else {
        for(let i in msg) msg[i] = Number(msg[i]);
        
        for(let j in global.temp.threadPending.list){
            let i = global.temp.threadPending.list[j];
            
            if(msg.indexOf(Number(j)+1) != -1){
                api.sendMessage(rt, i.threadID, (e)=>{
                    if(e){
                        api.deleteThread(i.threadID).catch(error => {
                            console.error(error.message);
                        });
                        console.error("Connected", `Can't connected to ${i.threadID} with error: ${e}`)
                    } else {
                        console.log("Connected", `Connected to ${i.threadID} success!`);
                    }
                }).catch(error => {
                    console.error(error.message);
                });

                done.push(i.name);
            } else {
                    api.removeUserFromGroup(global.botid, i.threadID).catch(error => {
                        console.error(error.message);
                    });
                    api.deleteThread(i.threadID).catch(error => {
                        console.error(error.message);
                    });;
                out.push(i.name);
            }
        }
    }

    let res = "";

    if(done.length > 0){
        let list = "";
        for(let i in done) list += "\n" + (Number(i)+1) + ". " + done[i];
        res += rlang("listDone").replaceAll("{list}", list) + "\n\n";
    }

    if(out.length > 0){
        let list = "";
        for(let i in out) list += "\n" + (Number(i)+1) + ". " + out[i];
        res += rlang("listOut").replaceAll("{list}", list);
    }

    api.sendMessage(res, data.threadID, ()=>{
        if(global.temp.threadPending.MID) {
            api.unsendMessage(global.temp.threadPending.MID);
            global.temp.threadPending = {};
        }
    }, data.messageID);
}

function connect(api, adv){
    if(adv.config.auto_connect){
        setInterval(function () {
            var lang = global.lang.Connected;
            var la = global.config.bot_info.lang;
            try{
            api.getThreadList(100, null, ["PENDING", "OTHER"], (e, l)=>{
                for(var i in l){
                    var rt = lang.connect[la].replace("{0}", global.config.bot_info.botname) + lang.help[la].replace("{0}", global.config.facebook.prefix);

                    api.sendMessage(rt , l[i].threadID, (e)=>{
                        if(e){
                            api.deleteThread(l[i].threadID);
                            console.error("Connected", `Can't connected to ${l[i].threadID} with error: ${e}`)
                        }else console.log("Connected", `Connected to ${l[i].threadID} success!`)
                    }).catch(error => {
                        console.error(error.message);
                    });
                }
            })
            }catch(e){}
        }, adv.config.time_auto_connect*60*1000);
    }
}

module.exports = {
	pending,
    chathook,
    connect,
    init
}
