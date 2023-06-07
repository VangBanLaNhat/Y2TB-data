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
            "Done":{
                "desc": "Done",
                "vi_VN": ["🌸 Hoàn tất!\n💥 Title: {nameidea}\n🍀 Tên tài khoản Tiktok: {name}\n💦 Username: {username}\n👀 Số lượt xem: {views}\n❤ Số lượt thích: {loves}\n💬 Số lượt bình luận: {comments}\n↪️Số lượt chia sẻ: {shares}\n⬇️ Số lượt tải xuống: {downloadC}\n💗 Số lượt yêu thích: {favorite}\nCảm ơn cậu đã sử dụng bot của tớ!"],
                "en_US": ["Done!\nTitle: {nameidea}\nTiktok Account Name: {name}\nUsername: {username}\nViews: {views}\nLikes: {loves}\nComments: {comments}\nShares: {shares}\nDownloads: {downloadC}\nLikes: {favorite}\nThanks for using my bot!"],
                "args": {}
            }
        }
    }
}
async function main(data, api, adv) {
    const { TiktokDL } = require("@tobyg74/tiktok-api-dl");
    const {rlang, replaceMap} = adv;

    try {
        const axios = require('axios');
        const fs = require('fs-extra');
        const path = require('path');
        const link = data.args[1];
        
        let lang = global.lang["Download Tiktok"];
    	let code = global.config.bot_info.lang;
    	
        if (!link) return api.sendMessage(lang.nolink[code], data.threadID, data.messageID);
        const res = await TiktokDL(link);
        //console.log(res);
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
        //console.log(nameidea);
        const response = await axios({
            method: 'get',
            url: res.result.video[1],
            responseType: 'stream'
        });
        
        let dir = path.join(__dirname, "temp", "cache", "tiktok", data.messageID+".mp4")
        ensureExists(path.join(__dirname, "temp", "cache", "tiktok"))

        let stream = response.data.pipe(fs.createWriteStream(dir));
        let map = {
        	"{nameidea}": nameidea,
        	"{name}": name,
        	"{username}": username,
        	"{views}": views,
        	"{loves}": loves,
        	"{comments}": comments,
        	"{shares}": shares,
        	"{downloadC}": downloadC,
        	"{favorite}": favorite
        }
        stream.on("finish", () => {
        	//console.log(rlang("Done"))
            api.sendMessage(({
            	
                body: replaceMap(rlang("Done"), map),
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