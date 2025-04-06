var path = require("path");

function init() {
    ensureExists(path.join(__dirname, "cache", "ytmp4"));
    ensureExists(path.join(__dirname, "cache", "ytmp3"));
    return {
        "pluginName": "YouTube",
        "pluginMain": "YouTube.js",
        "desc": {
            "vi_VN": "Lệnh Youtube",
            "en_US": "Youtube command"
        },
        "commandList": {
            "ytmp4": {
                "help": {
                    "vi_VN": "<Link YouTube || Từ khóa>",
                    "en_US": "<Link YouTube || Key word>"
                },
                "tag": {
                    "vi_VN": "Tải video về từ YouTube",
                    "en_US": "Download video from YouTube"
                },
                "mainFunc": "ytmp4",
                "example": {
                    "vi_VN": "ytmp4 https://www.youtube.com/watch?v=kTJczUoc26U",
                    "en_US": "ytmp4 https://www.youtube.com/watch?v=kTJczUoc26U"
                }
            },
            "ytmp3": {
                "help": {
                    "vi_VN": "<Link YouTube || Từ khóa>",
                    "en_US": "<Link YouTube || Key word>"
                },
                "tag": {
                    "vi_VN": "Tải audio về từ YouTube",
                    "en_US": "Download audio from YouTube"
                },
                "mainFunc": "ytmp3",
                "example": {
                    "vi_VN": "ytmp3 https://www.youtube.com/watch?v=kTJczUoc26U",
                    "en_US": "ytmp3 https://www.youtube.com/watch?v=kTJczUoc26U"
                }
            },
            "ytauto": {
                "help": {
                    "vi_VN": "<auto || mp3 || mp4 || off>",
                    "en_US": "<auto || mp3 || mp4 || off>"
                },
                "tag": {
                    "vi_VN": "Tự động tải về video/audio từ YouTube",
                    "en_US": "Automatically download video/audio from YouTube"
                },
                "mainFunc": "ytauto",
                "example": {
                    "vi_VN": "ytauto auto",
                    "en_US": "ytauto auto"
                }
            },
            "yts": {
                "help": {
                    "vi_VN": "<Từ khóa>",
                    "en_US": "<Key word>"
                },
                "tag": {
                    "vi_VN": "Tìm kiếm video trên YouTube",
                    "en_US": "Search video on YouTube"
                },
                "mainFunc": "search",
                "example": {
                    "vi_VN": "ytsearch stay",
                    "en_US": "ytsearch stay"
                }
            }
        },
        "nodeDepends": {
            "@distube/ytdl-core": "",
            "ytsr": "",
            "@ffmpeg-installer/ffmpeg": "",
            "fluent-ffmpeg": ""
        },
        "langMap": {
            "isLive": {
                "desc": "video directly",
                "vi_VN": "Không thể tải video trực tiếp!",
                "en_US": "Can't download video directly!",
                "args": {
                    "{0}": {
                        "vi_VN": "Prefix",
                        "en_US": "Prefix"
                    }
                }
            },
            "more": {
                "desc": "Video is larger than n minutes",
                "vi_VN": "Video không thể lớn hơn {m} phút",
                "en_US": "Video cannot be larger than {m} minutes!",
                "args": {
                    "{m}": {
                        "vi_VN": "Phút",
                        "en_US": "Minutes"
                    }
                }
            },
            "more25mb": {
                "desc": "Video greater than 25MB",
                "vi_VN": "Video lớn hơn 25MB!",
                "en_US": "Video greater than 25MB!",
                "args": {}
            },
            "noMSG": {
                "desc": "No input",
                "vi_VN": "Vui lòng nhập link YouTube hoặc từ khóa",
                "en_US": "Please enter the YouTube link or keywords",
                "args": {}
            },
            "downloading": {
                "desc": "Video is downloading",
                "vi_VN": "Đang tải: {0}",
                "en_US": "Downloading: {0}",
                "args": {
                    "{0}": {
                        "vi_VN": "tiêu đề",
                        "en_US": "title"
                    }
                }
            },
            "done": {
                "desc": "Video is downloaded successfully",
                "vi_VN": "Hoàn tất: {0}",
                "en_US": "Success: {0}",
                "args": {
                    "{0}": {
                        "vi_VN": "tiêu đề",
                        "en_US": "title"
                    }
                }
            },
            "srs": {
                "desc": "Search results",
                "vi_VN": "Kết quả tìm kiếm: \n{0}",
                "en_US": "Search results: \n{0}",
                "args": {
                    "{0}": {
                        "vi_VN": "Danh sách kết quả",
                        "en_US": "List of results"
                    }
                }
            },
            "ytrs": {
                "desc": "Search results",
                "vi_VN": "Reply số thứ tự để tải về: \n{0}",
                "en_US": "Reply the order number to download: \n{0}",
                "args": {
                    "{0}": {
                        "vi_VN": "Danh sách kết quả",
                        "en_US": "List of results"
                    }
                }
            },
            "NaN": {
                "desc": "Invalid ID",
                "vi_VN": "ID không hợp lệ",
                "en_US": "Invalid ID",
                "args": {}
            },
            "adh": {
                "desc": "Help auto download",
                "vi_VN": "Giá trị không hợp lệ! Dùng: {prefix}ytauto <auto || mp3 || mp4 || off>",
                "en_US": "Valid value! Use: {prefix}ytauto <auto || mp3 || mp4 || off>",
                "args": {
                    "{prefix}": {
                        "vi_VN": "prefix",
                        "en_US": "prefix"
                    }
                }
            },
            "autoOn": {
                "desc": "Turn YouTube Auto Download",
                "vi_VN": "Đã bật YouTube Auto Download tại thread này. Sẽ tự động tải xuống dưới dạng {type}",
                "en_US": "Turn on YouTube Auto Download at this thread. Will automatically download as {type}",
                "args": {
                    "{type}": {
                        "vi_VN": "Định dạng",
                        "en_US": "Type"
                    }
                }
            },
            "autoOff": {
                "desc": "Turn off YouTube Auto Download",
                "vi_VN": "Đã tắt YouTube Auto Download tại thread này.",
                "en_US": "Turn off YouTube Auto Download at this thread.",
                "args": {}
            },
            "noPer":{
                        "desc": "No permission",
                "vi_VN": "Không đủ quyền!",
                "en_US": "No permission!",
                "args": {}
                },
        },
        "config": {
            note: 'auto_download: "auto" (Recomend), "mp3", "mp4", "off"',
            auto_download: "auto",
            cookies: []
        },
        "chathook": "chathook",
        "author": "HerokeyVN",
        "version": "1.5.1"
    }
}

async function ytmp4(data, api, adv) {
    let { rlang, replaceMap } = adv;
    if (data.args[1] == undefined) return api.sendMessage(rlang("noMSG"), data.threadID, data.messageID);

    if (data.args.length == 2 && (data.args[1].indexOf("youtube.com") != -1 || data.args[1].indexOf("youtu.be") != -1)) return downmp4(data, api, adv, data.args[1]);

    //search

    if (global.temp.youtube.ytmp4[data.threadID][data.senderID]) {
        api.unsendMessage(global.temp.youtube.ytmp4[data.threadID][data.senderID].MID);
        delete global.temp.youtube.ytmp4[data.threadID][data.senderID];
    }

    let msg = data.body;
    var ytsr = require("ytsr");
    var axios = require("axios");

    var filters = await ytsr.getFilters(msg);
    var filter = filters.get('Type').get('Video');
    var options = {
        limit: 12,
    };

    var search = await ytsr(filter.url, options);
    var searchResults = JSON.parse(JSON.stringify(search));
    var items = (searchResults.items);
    var img = [];
    var listURL = [];
    var res = ``;
    let y = 1;
    items.forEach((x) => {
        if (y > 6) return;
        if (x.type != "video") return;
        let t = x.duration.split(":");
        if (t.length > 2) return;
        if (t.length == 2 && Number(t[0]) > 6) return;
        //console.log(x);
        img.push(axios({
            url: x.bestThumbnail.url.slice(0, x.bestThumbnail.url.indexOf("?")),
            method: "GET",
            responseType: "stream"
        }));
        res += `${y}. ${x.title} (${x.duration}):
${x.url}
`;
        y++;
        listURL.push(x.url);
    });
    var img = (await Promise.all(img)).map(x => x.data);
    var dataep = {
        body: "‍‍‍‍‍‍‍‍‍‍"+replaceMap(rlang("ytrs"), { "{0}": res }),
        attachment: img
    }
    api.sendMessage(dataep, data.threadID, (e, a) => {
        global.temp.youtube.ytmp4[data.threadID][data.senderID] = {
            MID: a.messageID,
            list: listURL
        }
    }, data.messageID);
}

async function ytmp3(data, api, adv) {
    let { rlang, replaceMap } = adv;
    if (data.args[1] == undefined) return api.sendMessage(rlang("noMSG"), data.threadID, data.messageID);

    if (data.args.length == 2 && (data.args[1].indexOf("youtube.com") != -1 || data.args[1].indexOf("youtu.be") != -1)) return downmp3(data, api, adv, data.args[1]);

    //search

    if (global.temp.youtube.ytmp3[data.threadID][data.senderID]) {
        api.unsendMessage(global.temp.youtube.ytmp3[data.threadID][data.senderID].MID);
        delete global.temp.youtube.ytmp3[data.threadID][data.senderID];
    }

    let msg = data.body;
    var ytsr = require("ytsr");
    var axios = require("axios");

    var filters = await ytsr.getFilters(msg);
    var filter = filters.get('Type').get('Video');
    var options = {
        limit: 12,
    };

    var search = await ytsr(filter.url, options);
    var searchResults = JSON.parse(JSON.stringify(search));
    var items = (searchResults.items);
    var img = [];
    var listURL = [];
    var res = ``;
    let y = 1;
    items.forEach((x) => {
        if (y > 6) return;
        if (x.type != "video") return;
        let t = x.duration.split(":");
        if (t.length > 2) return;
        if (t.length == 2 && Number(t[0]) > 10) return;
        //console.log(x);
        img.push(axios({
            url: x.bestThumbnail.url.slice(0, x.bestThumbnail.url.indexOf("?")),
            method: "GET",
            responseType: "stream"
        }));
        res += `${y}. ${x.title} (${x.duration}):
${x.url}
`;
        y++;
        listURL.push(x.url);
    });
    var img = (await Promise.all(img)).map(x => x.data);
    var dataep = {
        body: "‍‍‍‍‍‍‍‍‍‍"+replaceMap(rlang("ytrs"), { "{0}": res }),
        attachment: img
    }
    api.sendMessage(dataep, data.threadID, (e, a) => {
        global.temp.youtube.ytmp3[data.threadID][data.senderID] = {
            MID: a.messageID,
            list: listURL
        }
    }, data.messageID);
}

async function ytauto(data, api, {rlang, replaceMap, getThreadInfo}) {
    if(global.config.facebook.admin.indexOf(data.senderID) == -1) {
        let adminL = (await getThreadInfo(data.threadID)).adminIDs;
        let check = false;
        for(let i of adminL) if(i.id == data.senderID) {
            check = true; break;
        } 
        if(!check) return api.sendMessage(rlang("noPer"), data.threadID, data.messageID);
    }
    let type = data.args[1];
    if(type != "auto" && type != "mp3" && type != "mp4" && type != "off") return api.sendMessage(replaceMap(rlang("adh"), {"{prefix}": global.config.facebook.prefix}), data.threadID, data.messageID);

    global.data.youtube.autodown[data.threadID] = type;

    if(type == "off") return api.sendMessage(rlang("autoOff"), data.threadID, data.messageID);

    api.sendMessage(replaceMap(rlang("autoOn"), {"{type}": type}), data.threadID, data.messageID);
}

async function chathook(data, api, adv) {
    !global.temp.youtube ? global.temp.youtube = {} : "";
    !global.data.youtube ? global.data.youtube = {} : "";
    !global.temp.youtube.ytmp3 ? global.temp.youtube.ytmp3 = {} : "";
    !global.temp.youtube.ytmp3[data.threadID] ? global.temp.youtube.ytmp3[data.threadID] = {} : "";
    !global.temp.youtube.ytmp4 ? global.temp.youtube.ytmp4 = {} : "";
    !global.temp.youtube.ytmp4[data.threadID] ? global.temp.youtube.ytmp4[data.threadID] = {} : "";
    !global.data.youtube.autodown ? global.data.youtube.autodown = {} : "";
    !global.data.youtube.autodown[data.threadID] ? global.data.youtube.autodown[data.threadID] = adv.config.auto_download : "";

    if((data.type == "message" || data.type == "message_reply") && global.data.youtube.autodown[data.threadID] != "off" && data.body.indexOf("‍‍‍‍‍‍‍‍‍‍") != 0 && data.body.indexOf(global.config.facebook.prefix) != 0) {
        let args = data.body.split(" ");
        let ytdl = require('@distube/ytdl-core');

        for(let i of args) {
            if(i.indexOf("youtube.com") != -1 || i.indexOf("youtu.be") != -1){
                try {
                    var id = ytdl.getVideoID(i);
                    console.log(id);
                } catch (_){continue;}

                if(global.data.youtube.autodown[data.threadID] == "auto"){
                    try{
                        var info = await ytdl.getInfo(i);
                    } catch(e){continue;}

                    return Number(info.player_response.videoDetails.lengthSeconds) / 60 > 2 ? downmp3(data, api, adv, i):downmp4(data, api, adv, i);
                }

                return global.data.youtube.autodown[data.threadID] == "mp3" ? downmp3(data, api, adv, i):global.data.youtube.autodown[data.threadID] == "mp4" ? downmp4(data, api, adv, i):"";
            }
        }
    }

    if (data.type != "message_reply" || !global.temp.youtube || (!global.temp.youtube.ytmp3 && !global.temp.youtube.ytmp4)) return;
    if (!global.temp.youtube.ytmp3[data.threadID] && !global.temp.youtube.ytmp4[data.threadID]) return;

    if (global.temp.youtube.ytmp3[data.threadID][data.senderID] && data.messageReply.messageID == global.temp.youtube.ytmp3[data.threadID][data.senderID].MID) {
        let { rlang, replaceMap } = adv;
        let nb = Math.trunc(Number(data.body));
        if (!nb || nb < 1 || nb > global.temp.youtube.ytmp3[data.threadID][data.senderID].list.length) return api.sendMessage(rlang("NaN"), data.threadID, data.senderID);
        nb--;

        api.unsendMessage(global.temp.youtube.ytmp3[data.threadID][data.senderID].MID);

        downmp3(data, api, adv, global.temp.youtube.ytmp3[data.threadID][data.senderID].list[nb]);
        delete global.temp.youtube.ytmp3[data.threadID][data.senderID];
    } 
    if (global.temp.youtube.ytmp4[data.threadID][data.senderID] && data.messageReply.messageID == global.temp.youtube.ytmp4[data.threadID][data.senderID].MID) {
        let { rlang, replaceMap } = adv;
        let nb = Math.trunc(Number(data.body));
        if (!nb || nb < 1 || nb > global.temp.youtube.ytmp4[data.threadID][data.senderID].list.length) return api.sendMessage(rlang("NaN"), data.threadID, data.senderID);
        nb--;

        api.unsendMessage(global.temp.youtube.ytmp4[data.threadID][data.senderID].MID);

        downmp4(data, api, adv, global.temp.youtube.ytmp4[data.threadID][data.senderID].list[nb]);
        delete global.temp.youtube.ytmp4[data.threadID][data.senderID];
    }
}

async function downmp3(data, api, { rlang, replaceMap, config }, link) {
    var ytdl = require('@distube/ytdl-core');
    var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    var ffmpeg = require('fluent-ffmpeg');
    var fs = require("fs");
    ffmpeg.setFfmpegPath(ffmpegPath);

    try {
        let agent = ytdl.createAgent(config.cookies);
        //let agent = ytdl.createProxyAgent({ uri: "136.226.67.116:8800" }, [ {name: "cookie", value: config.cookies} ]);
        let id = ytdl.getVideoID(link, { agent })+(new Date()).getTime();
        let info = await ytdl.getInfo(link, { agent });
        if (info.player_response.videoDetails.isLiveContent) {
            api.sendMessage(rlang("isLive"), data.threadID, data.messageID);
            return;
        }
        if (Number(info.player_response.videoDetails.lengthSeconds) / 60 > 10) {
            api.sendMessage(replaceMap(rlang("more"), { "{m}": 10 }), data.threadID, data.messageID);
            return;
        }
        ensureExists(path.join(__dirname, "cache", "ytmp3"));
        let dirMp4 = path.join(__dirname, "cache", "ytmp3", id + ".mp4");
        let dirMp3 = path.join(__dirname, "cache", "ytmp3", id + ".mp3");

        let map = {
            "{0}": info.player_response.videoDetails.title
        }
        api.sendMessage(replaceMap(rlang("downloading"), map), data.threadID, data.messageID);

        // Tải video và lưu tạm thời dưới dạng .mp4
        await new Promise((resolve, reject) => {
            ytdl(link, {
                quality: 'highestaudio',
                agent
            })
                .pipe(fs.createWriteStream(dirMp4))
                .on('finish', resolve)
                .on('error', reject);
        });

        // Chuyển đổi từ .mp4 sang .mp3
        await convertToMp3(dirMp4, dirMp3);

        // Xóa file .mp4 sau khi chuyển đổi
        fs.unlinkSync(dirMp4);

        // Kiểm tra kích thước file .mp3 và gửi tin nhắn
        const fileSize = fs.statSync(dirMp3).size;
        if (fileSize > 26214400) {
            api.sendMessage(rlang("more25mb"), data.threadID, () => fs.unlinkSync(dirMp3), data.messageID);
        } else {
            api.sendMessage({
                attachment: fs.createReadStream(dirMp3)
            }, data.threadID, () => fs.unlinkSync(dirMp3), data.messageID);
        }
        // let progressHandler = p => {
        //     if (process.stdout.isTTY) { // Check if stdout is a TTY
        //         process.stdout.clearLine(0);
        //         process.stdout.cursorTo(0);
        //     }
        //     console.log("ytmp3", `${p.targetSize}KB downloaded!`);
        // };
        // ffmpeg(vdo).audioBitrate(128).save(dirr)
        //     .on('progress', progressHandler)
        //     .on('end', () => {
        //     if (fs.statSync(dirr).size > 26214400) 
        //         api.sendMessage(rlang("more25mb"), data.threadID, () => fs.unlinkSync(dirr), data.messageID)
        //     else api.sendMessage({
        //         attachment: fs.createReadStream(dirr)
        //     }, data.threadID, () => fs.unlinkSync(dirr), data.messageID)
        // });
    } catch (err) {
        console.error("ytmp3", err);
        api.sendMessage(err + "", data.threadID, data.messageID)
    }
}

function convertToMp3(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioBitrate(128)
            .save(outputPath)
            .on('end', resolve)
            .on('error', reject);
    });
}

async function downmp4(data, api, { rlang, replaceMap, config }, link) {
    var fs = require('fs');
    var ytdl = require("@distube/ytdl-core");

    try {
        var agent = ytdl.createAgent(config.cookies);
        var info = await ytdl.getInfo(link, { agent });
        ensureExists(path.join(__dirname, "cache", "ytmp4"));
        var dirr = path.join(__dirname, "cache", "ytmp4", ytdl.getVideoID(link)+(new Date()).getTime() + ".mp4")
        if (info.player_response.videoDetails.isLiveContent) {
            api.sendMessage(rlang("isLive"), data.threadID, data.messageID);
            return;
        }
        if (Number(info.player_response.videoDetails.lengthSeconds) / 60 > 6) {
            api.sendMessage(replaceMap(rlang("more"), { "{m}": 6 }), data.threadID, data.messageID);
            return;
        }

        let map = {
            "{0}": info.player_response.videoDetails.title
        }
        api.sendMessage(replaceMap(rlang("downloading"), map), data.threadID, data.messageID);

        ytdl(link, {
            quality: 'highestaudio',
            agent
        }).pipe(fs.createWriteStream(dirr)).on("close", () => {
            if (fs.statSync(dirr).size > 26214400) api.sendMessage(rlang("more25mb"), data.threadID, () => fs.unlinkSync(dirr), data.messageID);
            else api.sendMessage({
                attachment: fs.createReadStream(dirr)
            }, data.threadID, () => fs.unlinkSync(dirr), data.messageID)
        })
    } catch (err) {
        console.error("ytmp4", err);
        api.sendMessage(err + "", data.threadID, data.messageID);
    }
}

var search = async function (data, api, { rlang, replaceMap }) {
    var ytsr = require("ytsr");
    var axios = require("axios");

    var msg = data.body
    //console.log(msg)
    if (msg) {
        var filters = await ytsr.getFilters(msg);
        var filter = filters.get('Type').get('Video');
        var options = {
            limit: 6,
        };
        //console.log(filters);
        var search = await ytsr(filter.url, options);
        var searchResults = JSON.parse(JSON.stringify(search));
        var items = (searchResults.items);
        var img = [];
        var res = ``
        items.forEach((x, y) => {
            //console.log(x);
            if (x.type != "video") return;
            img.push(axios({
                url: x.bestThumbnail.url.slice(0, x.bestThumbnail.url.indexOf("?")),
                method: "GET",
                responseType: "stream"
            }));
            res += `${y + 1}. ${x.title} (${x.duration}):
${x.url}
`;
        });
        var img = (await Promise.all(img)).map(x => x.data);
        var dataep = {
            body: "‍‍‍‍‍‍‍‍‍‍"+replaceMap(rlang("srs"), { "{0}": res }),
            attachment: img
        }
        api.sendMessage(dataep, data.threadID, data.messageID);
    }
    else {
        api.sendMessage(rlang("noMSG"), data.threadID, data.messageID);
    };
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
    ytmp4,
    ytmp3,
    chathook,
    ytauto,
    init,
    search
};
