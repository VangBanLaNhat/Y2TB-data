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
            "@tobyg74/tiktok-api-dl": ""
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
                "vi_VN": ["🌸 Hoàn tất!\n💥 Title: ", "\n🍀 Tên tài khoản Tiktok: ", "\n💦 Username: ", "\n👀 Số lượt xem: ", "\n❤ Số lượt thích: ", "\n💬 Số lượt bình luận: ", "\n↪️Số lượt chia sẻ: ","\n⬇️ Số lượt tải xuống: ", "\n💗 Số lượt yêu thích: ","\nCảm ơn cậu đã sử dụng bot của tớ!"],
                "en_US": ["Successfully!! \n Tiktok account name: ", " \n Username: ", " \n Views: ", " \n Likes: ", " \n Comments: ", " \n Shares: ", " \n Thank you for using my bot!"],
                "args": {}
            }
        }
    }
}
async function main(data, api) {
    const { TiktokDL } = require("@tobyg74/tiktok-api-dl")

    try {
        const axios = require('axios');
        const fs = require('fs-extra');
        const path = require('path');
        const link = data.args[1];
        
        let lang = global.lang["Download Tiktok"];
    	let code = global.config.bot_info.lang;
    	
        if (!link) return api.sendMessage(lang.nolink[code], data.threadID, data.messageID);
        const res = await TiktokDL(link);
        console.log(res);
        if(res.status == "error") return api.sendMessage(lang.nolink[code], data.threadID, data.messageID);
        var nameidea = res.result.description;
        var name = res.result.author.nickname;
        var username = res.result.author.username;
        var views = res.result.statistics.playCount;
        var loves = res.result.statistics.likeCount;
        var comments = res.result.statistics.commentCount;
        var shares = res.result.statistics.shareCount;
        var favorite = res.result.statistics.favoriteCount;
        var downloadC = res.result.statistics.downloadCount;
        console.log(nameidea);
        const response = await axios({
            method: 'get',
            url: res.result.video[1],
            responseType: 'stream'
        });
        
        let dir = path.join(__dirname, "temp", "cache", "tiktok", data.messageID+".mp4")
        ensureExists(path.join(__dirname, "temp", "cache", "tiktok"))

        let stream = response.data.pipe(fs.createWriteStream(dir));
        stream.on("finish", () => {
        	let done = lang.done[code];
            api.sendMessage(({
                body: done[0]+nameidea+done[1]+name+done[2]+username+done[3]+views+done[4]+loves+done[5]+comments+done[6]+shares+done[7]+downloadC+done[8]+favorite,
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
