function init() {
    return {
        "pluginName": "Download Tiktok",
        "pluginMain": "DLTiktok.js",
        "desc": {
            "vi_VN": "Tải video Tiktok từ link!",
            "en_US": "Download Tiktok videos from the link!",
        },
        "commandList": {
            "tik": {
                "help": {
                    "vi_VN": "<link video tiktok>",
                    "en_US": "<link video tiktok>",
                },
                "tag": {
                    "vi_VN": "Tải video Tiktok từ link!",
                    "en_US": "Download Tiktok videos from the link!",
                },
                "mainFunc": "main",
                "example": {
                    "vi_VN": "https://vt.tiktok.com/ZSL145Wsd/",
                    "en_US": "https://vt.tiktok.com/ZSL145Wsd/",
                }
            }
        },
        "author": "Yuuki",
        "version": "0.0.1",
        "nodeDepends": {
            "tiktok-video-downloader": ""
        },
        "langMap":{
            "nolink":{
                "desc": "Send went no input",
                "vi_VN": "Vui lòng nhập link video Tiktok!",
                "en_US": "Please enter the Tiktok video link!",
                "args": {}
            },
            "done":{
                "desc": "Done",
                "vi_VN": ["Successfully!! \n Tên tài khoản Tiktok: ", " \n Username: ", " \n Số lượt xem: ", " \n Số lượt thích: ", " \n Số comments: ", " \n Số lượt chia sẻ: ", " \n Cảm ơn bạn đã sử dụng bot của tớ!"],
                "en_US": ["Successfully!! \n Tiktok account name: ", " \n Username: ", " \n Views: ", " \n Likes: ", " \n Comments: ", " \n Shares: ", " \n Thank you for using my bot!"],
                "args": {}
            }
        }
    }
}
async function main(data, api) {
    try {
        const ttdl = require("tiktok-video-downloader");
        const axios = require('axios');
        const fs = require('fs-extra');
        const path = require('path');
        const link = data.args[1];
        
        let lang = global.lang["Download Tiktok"];
    	let code = global.config.bot_info.lang;
    	
        if (!link) return api.sendMessage(lang.nolink[code], data.threadID, data.messageID);
        const result = await ttdl.getInfo(link);
        console.log(result);
        var name = result.author.name;
        var username = result.author.username;
        var views = result.video.views;
        var loves = result.video.loves;
        var comments = result.video.comments;
        var shares = result.video.shares
        if(!result.video.url.no_wm) return api.sendMessage(lang.nolink[code], data.threadID, data.messageID);
        const response = await axios({
            method: 'get',
            url: result.video.url.no_wm,
            responseType: 'stream'
        });
        
        let dir = path.join(__dirname, "temp", "cache", "tiktok", data.messageID+".mp4")
        ensureExists(path.join(__dirname, "temp", "cache", "tiktok"))

        let stream = response.data.pipe(fs.createWriteStream(dir));
        stream.on("finish", () => {
        	let done = lang.done[code];
            api.sendMessage(({
                body: done[0]+name+done[1]+username+done[2]+views+done[3]+loves+done[4]+comments+done[5]+shares+done[6],
                attachment: fs.createReadStream(dir)
            }), data.threadID, ()=>fs.unlinkSync(dir), data.messageID);
        });
    } catch (err) {
        console.error(err);
        api.sendMessage(err, data.threadID, data.messageID)
    };
};

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
    main,
    init
}
