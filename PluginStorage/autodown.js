function init(){
    return{
        "pluginName":"Auto Download",
        "pluginMain":"autodown.js",
        "desc": {
            "vi_VN": "Tự động tải xuống video khi phát hiện link!",
            "en_US": "Automatically download videos when the link is detected!",
        },
        "commandList": {
            "autodown": {
                "help": {
                    "vi_VN": "Bật | Tắt tính năng autodown!",
                    "en_US": "Turn on | Turn off autodown!",
                },
                "tag": {
                    "vi_VN": "",
                    "en_US": "",
                },
                "mainFunc": "main",
                "example": {
                    "vi_VN": "https://vt.tiktok.com/ZSLY9BFPT/",
                    "en_US": "https://vt.tiktok.com/ZSLY9BFPT/",
                }
            }
        },
        "langMap": {
            "done":{
                "desc": "Done",
                "vi_VN": ["🌸 Hoàn tất!\n💥 Title: ", "\n🍀 Tên tài khoản Tiktok: ", "\n💦 Username: ", "\n👀 Số lượt xem: ", "\n❤ Số lượt thích: ", "\n💬 Số lượt bình luận: ", "\n↪️ Số lượt chia sẻ: ","\n⬇️ Số lượt tải xuống: ", "\n💗 Số lượt yêu thích: ","\nCảm ơn cậu đã sử dụng bot của tớ!"],
                "en_US": ["Successfully!! \n Tiktok account name: ", " \n Username: ", " \n Views: ", " \n Likes: ", " \n Comments: ", " \n Shares: ", " \n Thank you for using my bot!"],
                "args": {}
            },
            "turnOn": {
                "desc": "TurnOn",
                "vi_VN": ["🌸 Đã bật thành công tính năng Autodown!"],
                "en_US": ["Autodown has been successfully turned on!"], 
                "args": {}
            },
            "turnOff": {
                "desc": "TurnOff",
                "vi_VN": ["🌸 Đã tắt thành công tính năng Autodown!"],
                "en_US": ["Autodown has been successfully turned off!"],
                "args": {}
            },
            "urlTrue": {
                "desc": "UrlTrue",
                "vi_VN": ["❄ Đã phát hiện thấy URL TikTok: ", "\nTiến hành tự động tải xuống! 💦"],
                "en_US": ["Detected TikTok URL: ", "\nStart downloading automatically!"],
                "args": {}
            },
            "noPermision": {
                "desc": "NoPermision",
                "vi_VN": ["Không đủ quyền!"],
                "en_US": ["No permission!"],
                "args": {}
            },

        },
        "chathook": "bruh",
        "author": "Yuuki",
        "version": "0.0.1",
        "nodeDepends": {"@tobyg74/tiktok-api-dl": ""}
    }
}

async function main(data, api) {
    let abc = global.config.plug.autodown;
    let lang = global.lang["Auto Download"];
    let code = global.config.bot_info.lang;
    let noPermision = lang.noPermision[code];
    let turnOn = lang.turnOn[code];
    let turnOff = lang.turnOff[code];
    if(data.senderID != global.config.facebook.admin) { return api.sendMessage(noPermision[0] ,data.threadID, data.messageID)}
    if(abc == true) {
        global.config.plug.autodown = false; return api.sendMessage(turnOff[0] ,data.threadID, data.messageID)
    };
    if(abc == false) {
        global.config.plug.autodown = true; return api.sendMessage(turnOn[0] , data.threadID, data.messageID)
    }

}
async function bruh(data, api) {
    const { TiktokDL } = require("@tobyg74/tiktok-api-dl");
    const axios = require('axios');
        const fs = require('fs-extra');
        const path = require('path');
        let lang = global.lang["Auto Download"];
    	let code = global.config.bot_info.lang;
    regEx_tiktok = /(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//
    if(data.type == "message"){
    if(global.config.plug.autodown == false) {return console.log("");};
    if(data.args[0] == ".tik") { return console.log("")};
    //api.sendMessage(data.args[0], data.threadID, data.messageID);
    let urlTrue = lang.urlTrue[code];
    for(let i = 0; i< 30; i++) {
        let cc = data.args[i];
        let brah = new RegExp(regEx_tiktok).test(cc);
        if (brah == true) { api.sendMessage(urlTrue[0] + cc + urlTrue[1], data.threadID, data.messageID); } }
        for(let i = 0; i< 30; i++) {
            let cc = data.args[i];
            let brah = new RegExp(regEx_tiktok).test(cc);
            if (brah == true) { 
        const res = await TiktokDL(cc);
        var nameidea = res.result.description;
        var name = res.result.author.nickname;
        var username = res.result.author.username;
        var views = res.result.statistics.playCount;
        var loves = res.result.statistics.likeCount;
        var comments = res.result.statistics.commentCount;
        var shares = res.result.statistics.shareCount;
        var favorite = res.result.statistics.favoriteCount;
        var downloadC = res.result.statistics.downloadCount;

        const response = await axios({
            method: 'get',
            url: res.result.video[1],
            responseType: 'stream'
        });
let time = Date.parse(new Date());
        let dir = path.join(__dirname, "temp", "cache", "tiktok", time+".mp4")
        ensureExists(path.join(__dirname, "temp", "cache", "tiktok"))

        let stream = response.data.pipe(fs.createWriteStream(dir));
        stream.on("finish", () => {
        	let done = lang.done[code];
            api.sendMessage(({
                body: done[0]+nameidea+done[1]+name+done[2]+username+done[3]+views+done[4]+loves+done[5]+comments+done[6]+shares+done[7]+downloadC+done[8]+favorite,
                attachment: fs.createReadStream(dir)
            }), data.threadID, ()=>fs.unlinkSync(dir), data.messageID);
        });
    }}
    
}
}

function ensureExists(path, mask) {
    var fs = require('fs');
  if (typeof mask != 'number') {
    mask = 0o777;
  }
  try {
    fs.mkdirSync(path, {
      mode: mask,
      recursive: true
    });
    return;
  } catch (ex) {
    return {
      err: ex
    };
  }
}
module.exports = {
    init,
    main,
    bruh
}
