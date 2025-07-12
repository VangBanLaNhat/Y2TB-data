function init() {
    return {
        "pluginName": "Spotify",
        "pluginMain": "Spotify.js",
        "desc": {
            "vi_VN": "Tải nhạc từ Spotify",
            "en_US": "Download music from Spotify"
        },
        "commandList": {
            "spotifydl": {
                "help": {
                    "vi_VN": "<Link Spotify>",
                    "en_US": "<Link Spotify>"
                },
                "tag": {
                    "vi_VN": "Tải nhạc từ Spotify",
                    "en_US": "Download music from Spotify"
                },
                "mainFunc": "main",
                "example": {
                    "vi_VN": "spotifydl https://open.spotify.com/track/0r0fd0daJVSsIxCWbVdtc4",
                    "en_US": "spotifydl https://open.spotify.com/track/0r0fd0daJVSsIxCWbVdtc4"
                }
            },
            "spotifyauto": {
                "help": {
                    "vi_VN": "[on || off]",
                    "en_US": "[on || off]"
                },
                "tag": {
                    "vi_VN": "Bật/Tắt tự động tải nhạc từ Spotify",
                    "en_US": "Turn on/off automatically download music from Spotify"
                },
                "mainFunc": "auto",
                "example": {
                    "vi_VN": "spotifyauto",
                    "en_US": "spotifyauto"
                }
            },
            "spotifyalbum": {
                "help": {
                    "vi_VN": "[on || off]",
                    "en_US": "[on || off]"
                },
                "tag": {
                    "vi_VN": "Bật/Tắt tải Album Spotify",
                    "en_US": "Turn on/off download Album Spotify"
                },
                "mainFunc": "album",
                "example": {
                    "vi_VN": "spotifyauto",
                    "en_US": "spotifyauto"
                }
            }
        },
        "chathook": "chathook",        
        "nodeDepends": {
            "spottydl": "",
            "@distube/ytdl-core": "",
            "fluent-ffmpeg": "",
            "@ffmpeg-installer/ffmpeg": ""
        },        
        "langMap": {
            "more25mb": {
                "desc": "Video greater than 25MB",
                "vi_VN": "Video lớn hơn 25MB!",
                "en_US": "Video greater than 25MB!",
                "args": {}
            },
            "downloading": {
                "desc": "Song is downloading",
                "vi_VN": "Đang tải: {0}",
                "en_US": "Downloading: {0}",
                "args": {
                    "{0}": {
                        "vi_VN": "tên bài hát",
                        "en_US": "song name"
                    }
                }
            },
            "autoOn": {
                "desc": "Turn on Spotify Auto Download",
                "vi_VN": "Đã bật Spotify Auto Download tại thread này.",
                "en_US": "Turn on Spotify Auto Download at this thread.",
                "args": {},
            },
            "autoOff": {
                "desc": "Turn off Spotify Auto Download",
                "vi_VN": "Đã tắt Spotify Auto Download tại thread này.",
                "en_US": "Turn off Spotify Auto Download at this thread.",
                "args": {}
            },
            "albumOn": {
                "desc": "Turn on Spotify album Download",
                "vi_VN": "Đã bật tải xuống Album/Playlist tại thread này.",
                "en_US": "Download the Album/Playlist download at this thread.",
                "args": {},
            },
            "albumOff": {
                "desc": "Turn off Spotify album Download",
                "vi_VN": "Đã tắt tải xuống Album/Playlist tại thread này.",
                "en_US": "Turn off the Album/Playlist download at this thread.",
                "args": {}
            },
            "noPer": {
                "desc": "No permission",
                "vi_VN": "Không đủ quyền! Chỉ quản trị viên nhóm và quản trị viên BOT mới có thể dùng.",
                "en_US": "No permission! Only group administrators and BOT administrators can use.",
                "args": {}
            },
            "noAlbum": {
                "desc": "Do not download the entire album",
                "vi_VN": "Chế độ tải Album/Playlist đã bị tắt ở nhóm này. Vui lòng dùng '{prefix}spotifyalbum' để bật chế độ này.",
                "en_US": "The Album/Playlist download mode has been turned off in this group. Please use '{prefix}spotifyalbum' to turn on this mode.",
                "args": {}
            },
            "illegal": {
                "desc": "The link is not valid",
                "vi_VN": "Đường link không hợp lệ hoặc không tìm thấy bài hát!",
                "en_US": "The link is not valid or song not found!",
                "args": {}
            },
            "notSP": {
                "desc": "Format not yet supported",
                "vi_VN": "Định dạng chưa được hỗ trợ!",
                "en_US": "Format not yet supported!",
                "args": {}
            },
        },
        "config": {
            "albumDownload": false
        },
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

async function main(data, api, adv, chk, isAlbum) {
    if (!global.plugins["Y2TB"].plugins["YouTube"]) {
        return api.sendMessage("The YouTube plugin has never been installed. Please ask your BotChat admin to install the YouTube plugin to use this command!", data.threadID, data.messageID);
    }

    const path = require('path');
    const fs = require('fs');
    const ytdl = require('@distube/ytdl-core');
    const ffmpeg = require('fluent-ffmpeg');
    const SpottyDL = require('spottydl');
    var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    ffmpeg.setFfmpegPath(ffmpegPath);

    const link = chk ? chk: data.args[1];
    var info;
    try {
        info = await SpottyDL.getTrack(link);
    } catch (error) {
        console.warn("Spotify", error);
        if(chk) return;
        return api.sendMessage(adv.rlang("illegal"), data.threadID, data.messageID);
    }

    if (!info || !info.id) {
        if(chk) return;
        return api.sendMessage(adv.rlang("illegal"), data.threadID, data.messageID);
    }

    // Use the same config as Youtube plugin for ytdl agent
    const youtubeConfig = global.pluginPl["YouTube"];
    
    let name = new Date().getTime() + data.messageID + ".mp3";

    var dir = path.join(__dirname, "cache", "spotify");
    ensureExists(dir);
    dir = path.join(dir, name);

    try {
        let agent = ytdl.createAgent(youtubeConfig.cookies);
        let youtubeUrl = `https://www.youtube.com/watch?v=${info.id}`;
        
        // Check if video exists and get info
        let videoInfo = await ytdl.getInfo(youtubeUrl, { agent });
        
        if (videoInfo.player_response.videoDetails.isLiveContent) {
            if(chk) return;
            return api.sendMessage("Cannot download live content!", data.threadID, data.messageID);
        }
        
        if (Number(videoInfo.player_response.videoDetails.lengthSeconds) / 60 > 10) {
            if(chk) return;
            return api.sendMessage("Video cannot be larger than 10 minutes!", data.threadID, data.messageID);
        }

        let vdo = ytdl(youtubeUrl, {
            quality: 'highestaudio',
            agent
        });
        
        console.log("Spotify", `Downloading: ${info.title} by ${info.artist}`);
        if (!chk) {
            api.sendMessage(`Downloading: ${info.title} by ${info.artist}`, data.threadID, data.messageID);
        }

        let progressHandler = p => {
            if (process.stdout.isTTY) {
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
            }
            console.log("Spotify", `${p.targetSize}KB downloaded!`);
        };

        ffmpeg(vdo).audioBitrate(128).save(dir)
            .on('progress', progressHandler)
            .on('end', () => {
                console.log("Spotify", "Success: " + info.title + ". Sending...");
                if (fs.statSync(dir).size > 26214400) {
                    api.sendMessage(adv.rlang("more25mb"), data.threadID, () => fs.unlinkSync(dir), data.messageID);
                } else {
                    api.sendMessage({
                        body: `Success: ${info.title} by ${info.artist}`,
                        attachment: fs.createReadStream(dir)
                    }, data.threadID, () => fs.unlinkSync(dir), data.messageID);
                }
            })
            .on('error', (err) => {
                console.error("Spotify", err);
                if (fs.existsSync(dir)) fs.unlinkSync(dir);
                if (!chk) {
                    api.sendMessage("Error downloading: " + err.message, data.threadID, data.messageID);
                }
            });

    } catch (err) {
        console.error("Spotify", err);
        if (!chk) {
            api.sendMessage("Error: " + err.message, data.threadID, data.messageID);
        }
    }
}

async function auto(data, api, {rlang, getThreadInfo}) {
    if (global.config.facebook.admin.indexOf(data.senderID) == -1) {
        let adminL = (await getThreadInfo(data.threadID)).adminIDs;
        let check = false;
        for (let i of adminL) if (i.id == data.senderID) {
            check = true; break;
        }
        if (!check) return api.sendMessage(rlang("noPer"), data.threadID, data.messageID);
    }
    if (global.data.spotify.autodown[data.threadID] || (data.args[1] && data.args[1].toLowerCase() == "off")) {
        global.data.spotify.autodown[data.threadID] = false;
        return api.sendMessage(rlang("autoOff"), data.threadID, data.messageID);
    }

    global.data.spotify.autodown[data.threadID] = true;
    api.sendMessage(rlang("autoOn"), data.threadID, data.messageID);
}

async function album(data, api, {rlang, getThreadInfo}) {
    if (global.config.facebook.admin.indexOf(data.senderID) == -1) {
        let adminL = (await getThreadInfo(data.threadID)).adminIDs;
        let check = false;
        for (let i of adminL) if (i.id == data.senderID) {
            check = true; break;
        }
        if (!check) return api.sendMessage(rlang("noPer"), data.threadID, data.messageID);
    }
    if (global.data.spotify.album[data.threadID] || (data.args[1] && data.args[1].toLowerCase() == "off")) {
        global.data.spotify.album[data.threadID] = false;
        return api.sendMessage(rlang("albumOff"), data.threadID, data.messageID);
    }

    global.data.spotify.album[data.threadID] = true;
    api.sendMessage(rlang("albumOn"), data.threadID, data.messageID);
}

async function chathook(data, api, adv) {
    if (!global.plugins["Y2TB"].plugins["YouTube"]) {
        return ;
    }
    !global.data.spotify ? global.data.spotify = {}: "";
    !global.data.spotify.autodown ? global.data.spotify.autodown = {}: "";
    global.data.spotify.autodown[data.threadID] == undefined ? global.data.spotify.autodown[data.threadID] = true: "";
    !global.data.spotify.album ? global.data.spotify.album = {}: "";
    global.data.spotify.album[data.threadID] == undefined ? global.data.spotify.album[data.threadID] = false: "";

    if ((data.type != "message" && data.type != "message_reply") || !global.data.spotify.autodown[data.threadID] || data.body.indexOf(global.config.facebook.prefix) == 0) return;
    
    if (data.body.indexOf("spotify.com") == -1) return;
    
    var args = data.body.split(" ");
    
    for (let i of args) {
        if (i.indexOf("spotify.com") == -1) continue;
        
        // Check if it's a track link (spottydl handles individual tracks)
        if (i.indexOf("/track/") !== -1) {
            main(data, api, adv, i);
        }
    }
}

// Functions support

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
    auto,
    album,
    chathook
}