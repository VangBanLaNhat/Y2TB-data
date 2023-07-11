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
                    "vi_VN": "<Link YouTube>",
                    "en_US": "<Link YouTube>"
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
                    "vi_VN": "<Link YouTube>",
                    "en_US": "<Link YouTube>"
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
            "ytdl-core": "",
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
            }
        },
        "author": "HerokeyVN",
        "version": "1.0.0"
    }
}

async function ytmp4(data, api, { rlang, replaceMap }) {
    if (data.args[1] != undefined) {
        var fs = require('fs');
        var ytdl = require("ytdl-core");

        try {
            var info = await ytdl.getInfo(data.args[1]);
            var dirr = path.join(__dirname, "cache", "ytmp4", ytdl.getVideoID(data.args[1]) + ".mp4")
            if (info.player_response.videoDetails.isLiveContent) {
                api.sendMessage(rlang("isLive"), data.threadID, data.messageID);
                return;
            }
            if (Number(info.player_response.videoDetails.lengthSeconds) / 60 > 5) {
                api.sendMessage(replaceMap(rlang("more"), { "{m}": 5 }), data.threadID, data.messageID);
                return;
            }

            let map = {
                "{0}": info.player_response.videoDetails.title
            }
            api.sendMessage(replaceMap(rlang("downloading"), map), data.threadID, data.messageID);

            ytdl(data.args[1]).pipe(fs.createWriteStream(dirr)).on("close", () => {
                if (fs.statSync(dirr).size > 26214400) api.sendMessage(rlang("more25mb"), data.threadID, () => fs.unlinkSync(dirr), data.messageID);
                else api.sendMessage({
                    body: replaceMap(rlang("done"), map),
                    attachment: fs.createReadStream(dirr)
                }, data.threadID, () => fs.unlinkSync(dirr), data.messageID)
            })
        } catch (err) {
            console.error("ytmp4", err);
            api.sendMessage(err, data.threadID, data.messageID);
        }
    } else {
        api.sendMessage(rlang("noMSG"), data.threadID, data.messageID);
    }
}

async function ytmp3(data, api) {
    if (data.args[1] != undefined) {
        var ytdl = require('ytdl-core');
        var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
        var ffmpeg = require('fluent-ffmpeg');
        var fs = require("fs");
        ffmpeg.setFfmpegPath(ffmpegPath);

        let link = data.args[1];
        try {
            var id = ytdl.getVideoID(data.args[1])
            var info = await ytdl.getInfo(data.args[1]);
            if (info.player_response.videoDetails.isLiveContent) {
                api.sendMessage(rlang("isLive"), data.threadID, data.messageID);
                return;
            }
            if (Number(info.player_response.videoDetails.lengthSeconds) / 60 > 10) {
                api.sendMessage(replaceMap(rlang("more"), { "{m}": 10 }), data.threadID, data.messageID);
                return;
            }
            var dirr = path.join(__dirname, "cache", "ytmp3", id + ".mp3")

            let vdo = ytdl(link, {
                quality: 'highestaudio',
            });
            let map = {
                "{0}": info.player_response.videoDetails.title
            }
            api.sendMessage(replaceMap(rlang("downloading"), map), data.threadID, data.messageID);

            ffmpeg(vdo).audioBitrate(128).save(dirr).on('progress', p => {
                console.log("ytmp3", `${p.targetSize}KB downloaded`);
            }).on('end', () => {
                if (fs.statSync(dirr).size > 26214400) api.sendMessage(rlang("more25mb"), data.threadID, () => fs.unlinkSync(dirr), data.messageID)
                else api.sendMessage({
                    body: "Success: " + info.player_response.videoDetails.title,
                    attachment: fs.createReadStream(dirr)
                }, data.threadID, () => fs.unlinkSync(dirr), data.messageID)
            });
        } catch (err) {
            console.error("ytmp3", err);
            api.sendMessage(err, data.threadID, data.messageID)
        }
    } else {
        api.sendMessage(rlang("noMSG"), data.threadID, data.messageID);
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
        var viddata = items.map(x => x);
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
            body: replaceMap(rlang("srs"), { "{0}": res }),
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
    init,
    search
};
