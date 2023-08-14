function init() {
    return {
        "pluginName": "Auto Download",
        "pluginMain": "autodown.js",
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
            "Done": {
                "desc": "Done",
                "vi_VN": ["🌸 Hoàn tất!\n💥 Title: {nameidea}\n🍀 Tên tài khoản Tiktok: {name}\n💦 Username: {username}\n👀 Số lượt xem: {views}\n❤ Số lượt thích: {loves}\n💬 Số lượt bình luận: {comments}\n↪️ Số lượt chia sẻ: {shares}\n⬇️ Số lượt tải xuống: {downloadC}\n💗 Số lượt yêu thích: {favorite}\nCảm ơn cậu đã sử dụng bot của tớ!"],
                "en_US": ["Done!\nTitle: {nameidea}\nTiktok Account Name: {name}\nUsername: {username}\nViews: {views}\nLikes: {loves}\nComments: {comments}\nShares: {shares}\nDownloads: {downloadC}\nLikes: {favorite}\nThanks for using my bot!"],
                "args": {}
            },
            "turnOn": {
                "desc": "TurnOn",
                "vi_VN": "🌸 Đã bật thành công tính năng Autodown!",
                "en_US": "Autodown has been successfully turned on!",
                "args": {}
            },
            "turnOff": {
                "desc": "TurnOff",
                "vi_VN": "🌸 Đã tắt thành công tính năng Autodown!",
                "en_US": "Autodown has been successfully turned off!",
                "args": {}
            },
            "urlTruee": {
                "desc": "UrlTrue",
                "vi_VN": "❄ Đã phát hiện thấy URL TikTok: {link}\nTiến hành tự động tải xuống! 💦",
                "en_US": "Detected TikTok URL: {link}\nStart downloading automatically!",
                "args": {}
            },
            "noPermision": {
                "desc": "NoPermision",
                "vi_VN": "Không đủ quyền!",
                "en_US": "No permission!",
                "args": {}
            },

        },
        "config": {
            "autodown": true
        },
        "chathook": "bruh",
        "author": "Yuuki, HerokeyVN",
        "version": "0.1.0",
        "nodeDepends": {
            "@tobyg74/tiktok-api-dl": ""
        }
    }
}

async function main(data, api, adv) {
    let {
        rlang,
        config,
        getThreadInfo
    } = adv;

    //if (global.config.facebook.admin.indexOf(data.senderID) == -1) return api.sendMessage(rlang("noPermision"), data.threadID, data.messageID);

    if (global.config.facebook.admin.indexOf(data.senderID) == -1) {
        let adminL = (await getThreadInfo(data.threadID)).adminIDs;
        let check = false;
        for (let i of adminL) if (i.id == data.senderID) {
            check = true; break;
        }
        if (!check) return api.sendMessage(rlang("noPermision"), data.threadID, data.messageID);
    }

    if (global.data.autodown[data.threadID]) {
        global.data.autodown[data.threadID] = false; api.sendMessage(rlang("turnOff"), data.threadID, data.messageID)
    } else {
        global.data.autodown[data.threadID] = true; api.sendMessage(rlang("turnOn"), data.threadID, data.messageID)
    }

}
async function bruh(data, api, adv) {
    if (data.type != "message") return;

    let {
        rlang,
        config,
        replaceMap
    } = adv;

    !global.data.autodown ? global.data.autodown = {}: '';
    global.data.autodown[data.threadID] == undefined ? global.data.autodown[data.threadID] = config.autodown: '';


    if (!global.data.autodown[data.threadID]) return;
    if (data.body.indexOf(global.config.facebook.prefix) == 0) return;

    const {
        TiktokDL
    } = require("@tobyg74/tiktok-api-dl");


    regEx_tiktok = /(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//

    //api.sendMessage(data.args[0], data.threadID, data.messageID);
    for (let cc of data.args) {
        let brah = new RegExp(regEx_tiktok).test(cc);
        if (brah == true) api.sendMessage(replaceMap(rlang("urlTruee"), {
            "{link}": cc
        }), data.threadID, data.messageID);
    }
    for (let cc of data.args) {

        let brah = new RegExp(regEx_tiktok).test(cc);
        if (brah == true) {
            try {
                var res = await TiktokDL(cc);
            } catch (e) {
                return console.warn("Auto Download", e);
            }

            // console.log(res.result);

            if (res.result.type == "image") {
                await imageType(data, api, adv, res);
                continue;
            }

            await videoType(data, api, adv, res);
        }
    }

}

async function imageType(data, api, adv, res) {
    const path = require("path");
    const streamBuffers = require("stream-buffers");
    const axios = require('axios');
    const fetch = require("node-fetch");
    const fs = require("fs");

    let {
        rlang,
        config,
        replaceMap
    } = adv;
    var nameidea = res.result.description;
    var name = res.result.author.nickname;
    var username = res.result.author.username;
    var views = res.result.statistics.playCount;
    var loves = res.result.statistics.likeCount;
    var comments = res.result.statistics.commentCount;
    var shares = res.result.statistics.shareCount;
    var favorite = res.result.statistics.favoriteCount;
    var downloadC = res.result.statistics.downloadCount;


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

    let img = [],
    listFile = [];

    for (let i in res.result.images) {
        let x = res.result.images[i];
        let fetchimage = await fetch(x);
        let buffer = await fetchimage.buffer();
        let imagesx = new streamBuffers.ReadableStreamBuffer({
            frequency: 10,
            chunkSize: 1024
        });
        imagesx.path = path.join(__dirname, "cache", "tiktok", data.messageID+encodeURI(x)+".jpg");
        img.push(path.join(__dirname, "cache", "tiktok", data.messageID+encodeURI(x)+".jpg"));
        imagesx.put(buffer);
        imagesx.stop();

        listFile.push(imagesx);
    }

    const response = await axios({
        method: 'get',
        url: res.result.music[0],
        responseType: 'stream'
    });
    
    let time = Date.parse(new Date());
    let dir = path.join(__dirname, "cache", "tiktok", data.messageID+ time + ".mp3")
    ensureExists(path.join(__dirname, "cache", "tiktok"))

    let stream = response.data.pipe(fs.createWriteStream(dir));

    stream.on("finish", () => {
        api.sendMessage({
            body: replaceMap(rlang("Done"), map),
            attachment: listFile
        }, data.threadID, (e, a)=> {
            for (let i of img) {
                try {
                    fs.unlinkSync(i);
                } catch(_) {};
            }
            api.sendMessage(({
                attachment: fs.createReadStream(dir)
            }), data.threadID,() => fs.unlinkSync(dir), a.messageID);
        }, data.messageID);

    });
}

async function videoType(data, api, adv, res) {
    const fs = require('fs-extra');
    const path = require('path');
    const axios = require('axios');
    let {
        rlang,
        config,
        replaceMap
    } = adv;
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
    let dir = path.join(__dirname,
        "cache",
        "tiktok",
        time + ".mp4")
    ensureExists(path.join(__dirname,
        "cache",
        "tiktok"))

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
    stream.on("finish",
        () => {
            api.sendMessage(({
                body: replaceMap(rlang("Done"), map),
                attachment: fs.createReadStream(dir)
            }),
                data.threadID,
                () => fs.unlinkSync(dir),
                data.messageID);
        });
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