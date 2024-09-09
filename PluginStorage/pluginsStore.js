function init() {
	return {
		"pluginName": "Plugins Store",
		"pluginMain": "pluginsStore.js",
		"desc": {
			"vi_VN": "Cửa hàng Plugins",
			"en_US": "Plugins Store"
		},
		"commandList": {
			"store": {
				"help": {
					"vi_VN": "[-m][trang]",
					"en_US": "[-m][pages]"
				},
				"tag": {
					"vi_VN": "Xem các Plugins hiện có ở store",
					"en_US": "View available Plugins in store"
				},
				"mainFunc": "store",
				"example": {
					"vi_VN": "store",
					"en_US": "store"
				}
			}
		},
		"nodeDepends": {
			"axios": ""
		},
		"langMap":{
			"noper":{
				"desc": "No permission",
				"vi_VN": "Không đủ quyền!",
				"en_US": "No permission!",
				"args": {}
			},
			"ib":{
				"desc": "Inbox only",
				"vi_VN": "Lệnh chỉ hoạt động khi inbox!",
				"en_US": "Inbox only!",
				"args": {}
			},
			"fetchFall":{
				"desc": "When unable to connect to Github",
				"vi_VN": "Không thể kết nối đến máy chủ! Vui lòng thử lại sau.",
				"en_US": "Can not connect to server! Please try again later.",
				"args": {}
			},
			"store":{
				"desc": "List of commands available in Plugins Store",
				"vi_VN": "Danh sách các lệnh hiện có ở Plugins Store:\n{list}(trang {0}/{1})\n Hãy reply tin nhắn này kèm số thứ tự để cài đặt/gỡ cài đặt plugin tương ứng. Nhập “all” để cài đặt toàn bộ plugin ở trang hiện tại.",
				"en_US": "The list of commands is available at Plugins Store:\n{list}(page {0}/{1})\n Please reply to this message with the serial number to install/uninstall the corresponding plugin. Type “all” to install all plugins on the current page.",
				"args": {}
			},
			"insd":{
				"desc": "Installed",
				"vi_VN": "Đã cài đặt",
				"en_US": "Installed",
				"args": {}
			}
		},
		"chathook": "chathook",
		"author": "HerokeyVN",
		"version": "0.0.1"
	}
}

async function store(data, api, {rlang, replaceMap, iso639}) {
	if(global.config.facebook.admin.indexOf(data.senderID) == -1) return api.sendMessage(rlang("noper"), data.threadID, data.messageID);
	//if(data.isGroup) return api.sendMessage(rlang("ib"), data.threadID, data.messageID);
	!global.temp.plstore ? global.temp.plstore = {}:"";
	
	const axios = require("axios");
	const fs = require("fs");
	const path = require("path");
	try{
		!global.temp.plstore.store ? global.temp.plstore.store = (await axios({url: "https://raw.githubusercontent.com/VangBanLaNhat/Y2TB-data/main/PluginInfo.json"})).data:"";
	} catch (e) {
		console.error("Plugins Store", e);
		api.sendMessage(rlang("fetchFall"), data.threadID, data.messageID);
	}
	
	!global.temp.plstore.local ? global.temp.plstore.local = JSON.parse(fs.readFileSync(path.join(__dirname, "pluginList.json"))):"";
	let check = (data.args[1] == "-m");
	data.args[1] = data.args.pop();
	
	let page = Number(data.args[1]);
	page = !page ? 1:page;
	let max = check ? 50:10;
	let start = (page-1)*max;
	let end = page*max-1;
	let plst = global.temp.plstore.store;
	
	let list = "";
	for(let i = start; i <= end; i++){
		try{
			list += i+1+". "+plst[i].file+": "+plst[i][(iso639.split("_"))[0]]+(!global.temp.plstore.local[plst[i].file] ?"":" ("+rlang("insd")+")")+"\n";
		} catch (e){}
	}
	
	let map = {
		"{list}": list,
		"{0}": page,
		"{1}": Math.trunc(plst.length/max) + (!(plst.length%max) ? 0:1)
	}
	if(global.temp.plstore.chathook) api.unsendMessage(global.temp.plstore.chathook.messageID);
	api.sendMessage(replaceMap(rlang("store"), map), data.threadID, (e, a)=>{
		global.temp.plstore.chathook = {
			messageID: a.messageID,
			start: start,
			end: end,
			page: page,
			body: data.body
		};
		
	}, data.messageID);
}

function chathook(data, api, adv){
	if(data.type != "message_reply" || !global.temp.plstore || !global.temp.plstore.chathook) return;
	if(data.messageReply.messageID != global.temp.plstore.chathook.messageID) return;
	
	const axios = require("axios");
	const fs = require("fs");
	const path = require("path");
	
	let msg = (data.body.split(" "))[0].toLowerCase();
	let {start, end, body} = global.temp.plstore.chathook;
	let plst = global.temp.plstore.store;
	
	if(msg == "all"){
		for(let i = start; i <= end; i++)
			if(plst[i] && !global.temp.plstore.local[plst[i].file])
				global.temp.plstore.local[plst[i].file] = plst[i].ver;
	} else {
		let choose = Number(msg);
		if(!choose) return;
		choose--;
		if(choose < start && choose > end && !plst[choose]) return;
		if(global.temp.plstore.local[plst[choose].file]) delete global.temp.plstore.local[plst[choose].file];
		else global.temp.plstore.local[plst[choose].file] = plst[choose].ver;
	}
	fs.writeFileSync(path.join(__dirname, "pluginList.json"), JSON.stringify(global.temp.plstore.local));
	
	data.body = body;
	data.args = body.split(" ");
	store(data, api, adv);
}
module.exports = {
	store,
	chathook,
	init
};