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
                    "vi_VN": "[on || off]",
                    "en_US": "[on || off]",
                },
                "tag": {
                    "vi_VN": "Bật | Tắt tính năng autodown TikTok!",
                    "en_US": "Turn on | Turn off autodown TikTok!",
                },
                "mainFunc": "auto",
                "example": {
                    "vi_VN": "https://vt.tiktok.com/ZSLY9BFPT/",
                    "en_US": "https://vt.tiktok.com/ZSLY9BFPT/",
                }
            }
        },
        "chathook": "bruh",
        "author": "ReineOwO",
        "version": "0.1.4",
        "nodeDepends": {
            "@tobyg74/tiktok-api-dl": ""
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
    const Tiktok = require("@tobyg74/tiktok-api-dl")
    const { rlang, replaceMap } = adv;

    try {
        const axios = require('axios');
        const fs = require('fs-extra');
        const path = require('path');
        const link = data.args[1];

        let lang = global.lang["Download Tiktok"];
        let code = global.config.bot_info.lang;

        if (!link) return api.sendMessage(lang.nolink[code], data.threadID, data.messageID);
        var res = await Tiktok.Downloader(link, {
            version: "v1",
            showOriginalResponse: true
        });

        if (res.status == "error") return api.sendMessage(lang.nolink[code], data.threadID, data.messageID);

        if (res.resultNotParsed.music.playUrl[0] == res.resultNotParsed.content.video.play_addr.uri) {
            imageType(data, api, adv, link);
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

    if (global.data.autodown[data.threadID] || (data.args[1] && data.args[1].toLowerCase() == "off")) {
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
    const Tiktok = require("@tobyg74/tiktok-api-dl")
    regEx_tiktok = /(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//

    for (let cc of data.args) {
        let brah = new RegExp(regEx_tiktok).test(cc);
        if (brah == true) api.sendMessage(replaceMap(rlang("urlTruee"), {
            "{link}": cc
        }), data.threadID, data.messageID);
    }
    for (let cc of data.args) {

        let brah = new RegExp(regEx_tiktok).test(cc);
        if (brah == true) {
            let res;
            try {
                res = await Tiktok.Downloader(cc, {
                    version: "v1",
                    showOriginalResponse: true
                });
            } catch (e) {
                return console.warn("Auto Download", e);
            }

            if (!res.resultNotParsed) continue;

            // if (res.data.type == "image") {
            //     await imageType(data, api, adv, res);
            //     continue;
            // }
            if (res.resultNotParsed.music.playUrl[0] == res.resultNotParsed.content.video.play_addr.uri) {
                imageType(data, api, adv, cc);
                continue;
            }

            await videoType(data, api, adv, res);
        }
    }

}

async function imageType(data, api, adv, link) {
    const Tiktok = require("@tobyg74/tiktok-api-dl")
    const path = require("path");
    const streamBuffers = require("stream-buffers");
    const axios = require('axios');
    const fetch = require("node-fetch");
    const fs = require("fs");

    let vers = "v1";
    let res = await Tiktok.Downloader(link, {
        version: vers,
        showOriginalResponse: true
    });
    // console.log(res.resultNotParsed.content.image_post_info.images[1].display_image.url_list)
    // console.log("1")
    // if (res.status == "error") {
    //     vers = "v2";
    //     res = await TiktokDownloader.Downloader(link, {
    //                 version: vers
    //             });
    //     console.log(vers, res);
    // }

    // if (res.status == "error" || res.result.images[0] == undefined) {
    //     vers = "v3";
    //     res = await TiktokDownloader.Downloader(link, {
    //                 version: vers
    //             });
    //     console.log(vers, res);
    // }

    let {
        rlang,
        config,
        replaceMap
    } = adv;
    if (!res.resultNotParsed.statistics) res.resultNotParsed.statistics = {};
    var nameidea = res.resultNotParsed.content.desc;
    var name = res.resultNotParsed.author.nickname;
    var username = res.resultNotParsed.author.username;
    var views = res.resultNotParsed.statistics.playCount;
    var loves = res.resultNotParsed.statistics.diggCount;
    var comments = res.resultNotParsed.statistics.commentCount;
    var shares = res.resultNotParsed.statistics.shareCount;
    var favorite = res.resultNotParsed.statistics.collectCount;
    var downloadC = res.resultNotParsed.statistics.downloadCount;

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

    for (let i in res.resultNotParsed.content.image_post_info.images) {
        let x = res.resultNotParsed.content.image_post_info.images[i].display_image.url_list[0];
        let fetchimage = await fetch(x);
        let buffer = await fetchimage.buffer();
        let imagesx = new streamBuffers.ReadableStreamBuffer({
            frequency: 10,
            chunkSize: 1024
        });
        imagesx.path = path.join(__dirname, "cache", "tiktok", data.messageID + encodeURI(x) + ".jpg");
        img.push(path.join(__dirname, "cache", "tiktok", data.messageID + encodeURI(x) + ".jpg"));
        imagesx.put(buffer);
        imagesx.stop();

        listFile.push(imagesx);
    }
    const response = await axios({
        method: 'get',
        url: res.resultNotParsed.music.playUrl[0],
        responseType: 'stream'
    });

    let time = Date.parse(new Date());
    let dir = path.join(__dirname, "cache", "tiktok", data.messageID + time + ".mp3")
    ensureExists(path.join(__dirname, "cache", "tiktok"))

    let stream = response.data.pipe(fs.createWriteStream(dir));

    stream.on("finish", () => {
        api.sendMessage({
            body: replaceMap(rlang("Done"), map),
            attachment: listFile
        }, data.threadID, (e, a) => {
            for (let i of img) {
                try {
                    fs.unlinkSync(i);
                } catch (_) { };
            }
            api.sendMessage(({
                attachment: fs.createReadStream(dir)
            }), data.threadID, () => fs.unlinkSync(dir), a.messageID);
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
    var nameidea = res.resultNotParsed.content.desc;
    var name = res.resultNotParsed.author.nickname;
    var username = res.resultNotParsed.author.username;
    var views = res.resultNotParsed.statistics.playCount;
    var loves = res.resultNotParsed.statistics.diggCount;
    var comments = res.resultNotParsed.statistics.commentCount;
    var shares = res.resultNotParsed.statistics.shareCount;
    var favorite = res.resultNotParsed.statistics.collectCount;
    var downloadC = res.resultNotParsed.statistics.downloadCount;

    const response = await axios({
        method: 'get',
        url: res.resultNotParsed.content.video.play_addr.url_list[0],
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
    main,
    auto,
    bruh,
    init
}
