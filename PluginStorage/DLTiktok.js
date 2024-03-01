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
            },
            "tikauto": {
                "help": {
                    "vi_VN": "Bật | Tắt tính năng autodown TikTok!",
                    "en_US": "Turn on | Turn off autodown TikTok!",
                },
                "tag": {
                    "vi_VN": "",
                    "en_US": "",
                },
                "mainFunc": "auto",
                "example": {
                    "vi_VN": "https://vt.tiktok.com/ZSLY9BFPT/",
                    "en_US": "https://vt.tiktok.com/ZSLY9BFPT/",
                }
            }
        },
        "chathook": "bruh",
        "author": "Yuuki",
        "version": "0.1.0",
        "nodeDepends": {
            "nayan-media-downloader": "2.0.4",
            "@tobyg74/tiktok-api-dl": "1.0.14"
        },
        "config": {
            "autodown": true
        },
        "langMap": {
            "nolink": {
                "desc": "Send went no input",
                "vi_VN": "Vui lòng nhập link video Tiktok!",
                "en_US": "Please enter the Tiktok video link!",
                "args": {}
            },
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
            }
        }
    }
}
async function main(data, api, adv) {
    const { tikdown } = require("nayan-media-downloader");
    const { TiktokDownloader } = require("@tobyg74/tiktok-api-dl");
    const { rlang, replaceMap } = adv;

    try {
        const axios = require('axios');
        const fs = require('fs-extra');
        const path = require('path');
        const link = data.args[1];

        let lang = global.lang["Download Tiktok"];
        let code = global.config.bot_info.lang;

        if (!link) return api.sendMessage(lang.nolink[code], data.threadID, data.messageID);
        var res = await tikdown(link);

        if (res.status == "error") return api.sendMessage(lang.nolink[code], data.threadID, data.messageID);

        if (res.data.video == res.data.audio) {
            res = await TiktokDownloader(link, {
                version: "v1" //  version: "v1" | "v2" | "v3"
            });
            imageType(data, api, adv, res);

            //api.sendMessage("Ảnh cái cc bố ko hỗ trợ ok!", data.threadID, data.messageID); 
            return;
        }
        await videoType(data, api, adv, res);
    } catch (err) {
        console.error(err);
        api.sendMessage(err, data.threadID, data.messageID)
    };
};

async function auto(data, api, adv) {
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

    !global.data.autodown ? global.data.autodown = {} : '';
    global.data.autodown[data.threadID] == undefined ? global.data.autodown[data.threadID] = config.autodown : '';


    if (!global.data.autodown[data.threadID]) return;
    if (data.body.indexOf(global.config.facebook.prefix) == 0) return;

    const { tikdown } = require("nayan-media-downloader");


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
                var res = await tikdown(cc);
            } catch (e) {
                return console.warn("Auto Download", e);
            }

            console.log(res);
            if (!res.data) continue;

            // if (res.data.type == "image") {
            //     await imageType(data, api, adv, res);
            //     continue;
            // }

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

    /*
     {
  status: 'success',
  result: {
    type: 'image',
    id: '7325004576195726593',
    createTime: 1705485537,
    description: '#xuhuong #fyp #pthanhdanh_o7 ',
    hashtag: [ 'xuhuong', 'fyp', 'pthanhdanh_o7' ],
    author: {
      uid: '7291670076872377349',
      username: '_thanhdanh.o7',
      nickname: '𝑇ℎ𝑎𝑛ℎ 𝐷𝑎𝑛ℎ ?'      ,
      signature: '📍follow me📍\ntdanh 💦',
      region: 'VN',
      avatarThumb: [Array],
      avatarMedium: [Array],
      url: 'https://www.tiktok.com/@_thanhdanh.o7'
    },
    statistics: {
      playCount: 4332280,
      downloadCount: 17383,
      shareCount: 3043,
      commentCount: 4930,
      likeCount: 244571,
      favoriteCount: 23860,
      forwardCount: 0,
      whatsappShareCount: 0,
      loseCount: 0,
      loseCommentCount: 0
    },
    images: [
      'https://p16-sign-sg.tiktokcdn.com/tos-alisg-i-photomode-sg/af5c90c9834d4e159948347b94e019a7~tplv-photomode-image-v1:q80.heic?from=photomode.FEED&lk3s=d05b14bd&x-expires=1710579600&x-signature=j8HA5mP6gJLjZP2cRnto9qNS04o%3D',
      'https://p16-sign-sg.tiktokcdn.com/tos-alisg-i-photomode-sg/9590082fe20842a9bbe8f0b5b5114b67~tplv-photomode-image-v1:q80.heic?from=photomode.FEED&lk3s=d05b14bd&x-expires=1710579600&x-signature=xXaP5%2FjoXy44nfNmDM%2BnPv3b4MQ%3D'
    ],
    music: {
      id: 7323228990943022000,
      title: 'original sound - ng...yen.nhi',
      author: 'Ng yến nhi (cún) 🍁',
      album: '',
      playUrl: [Array],
      coverLarge: [Array],
      coverMedium: [Array],
      coverThumb: [Array],
      duration: 13
    }
  }
}
    */

    let {
        rlang,
        config,
        replaceMap
    } = adv;
    var nameidea = res.result.description;//
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

    console.log(res.result.music.playUrl[0]);
    //return;
    const response = await axios({
        method: 'get',
        url: res.result.music.playUrl[0],
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
    var nameidea = res.data.title;
    var name = res.data.author.nickname;
    var username = res.data.author.unique_id;
    var views = res.data.play;
    var loves = res.data.view;
    var comments = res.data.comment;
    var shares = res.data.share;
    // var favorite = res.result.statistics.favoriteCount;
    var downloadC = res.data.download;

    const response = await axios({
        method: 'get',
        url: res.data.video,
        responseType: 'stream'
    });
    let time = Date.parse(new Date());
    //if(res.data.video == res.data.audio) {api.sendMessage("Ảnh cái cc bố ko hỗ trợ ok!", data.threadID, data.messageID); return;}
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
        // "{favorite}": favorite
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
    main,
    auto,
    bruh,
    init
}
