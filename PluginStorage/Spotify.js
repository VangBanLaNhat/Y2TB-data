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
            "jsdom": "22.1.0",
            
            "ytdl-core": "",
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
                "vi_VN": "Đường link không hợp lệ!",
                "en_US": "The link is not valid!",
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
    const path = require('path');
    const fs = require('fs');
    const ytdl = require('ytdl-core');
    const ffmpeg = require('fluent-ffmpeg');
    var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    ffmpeg.setFfmpegPath(ffmpegPath);

    const link = chk ? chk: data.args[1];
    var info;
    try {
        info = await getInfo(link);
    } catch (error) {
        console.warn("Spotify", error);
        if(chk) return;
        return api.sendMessage(adv.rlang("illegal"), data.threadID, data.messageID);
    }
    var ytid;

    if (info.type == "music.song") ytid = await getID(info.title, info.artist);
    else if (info.type == "music.album" || info.type == "music.playlist") {
        if (!global.data.spotify.album[data.threadID]) {
            if (!chk) api.sendMessage(adv.replaceMap(adv.rlang("noAlbum"), {
                "{prefix}": global.config.facebook.prefix
            }), data.threadID, data.messageID);
            return;
        }
        let list = await getListTrack(info.link);
        for (let i of list) {
             main(data, api, adv, i, true);
             await new Promise((t)=>setTimeout(t, 5000));
        }
        console.log("Spotify", "Fetch data from album is done, the download process will continue!")
        return;
    } else return api.sendMessage(adv.rlang("notSP"), data.threadID, data.messageID);


    let name = new Date().getTime() + data.messageID + ".mp3";

    var dir = path.join(__dirname, "cache", "spotify");
    ensureExists(dir);
    dir = path.join(dir, name);

    let stream = ytdl(ytid, {
        quality: "highestaudio"
    });
    
    info.ytid = ytid;
    console.log("Spotify", info);
    //ffmpeg(stream).audioBitrate(128).save
    ffmpeg(stream).audioBitrate(128).save(dir).on('end', () => {
        console.log("Spotify", "Success: " + info.title+". Sending...");
        if (fs.statSync(dir).size > 26214400) api.sendMessage(rlang("more25mb"), data.threadID, () => fs.unlinkSync(dir), data.messageID)
        else
            api.sendMessage({
            body: "Success: " + info.title,
            attachment: fs.createReadStream(dir)
        }, data.threadID, () => fs.unlinkSync(dir), data.messageID)
    });

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
        
        let type = (await getInfo(i)).type;
        if (type != "music.song") continue;
        
        main(data, api, adv, i);
    }
}

// Functions support

async function getInfo(url) {
    const {
        JSDOM
    } = require("jsdom");
    const fetch = require("node-fetch");

    const {
        hostname,
        pathname
    } = new URL(url);
    const path = pathname.replace("/sent/", "");
    const finalUrl = `https://${hostname}${path}`;
    const response = await fetch(finalUrl);
    if (!response.ok) {
        return {
            error: `HTTP error ${response.status}`
        };
    }
    const body = await response.text();

    const dom = new JSDOM(body).window.document;
    const res = {
        type: dom.querySelector('meta[property="og:type"]').content,
        link: dom.querySelector('meta[property="og:url"]').content,
        title: dom.querySelector('meta[property="og:title"]').content,
        artist: dom.querySelector('meta[property="og:description"]') ? dom.querySelector('meta[property="og:description"]').content.split(" · ")[0]:"",
        date: dom.querySelector('meta[name="music:release_date"]') ? dom.querySelector('meta[name="music:release_date"]').content:"",
        image: dom.querySelector('meta[name="twitter:image"]') ? dom.querySelector('meta[name="twitter:image"]').content:""
    }

    //console.log(res);

    return res;
}

async function getID(name, artist) {
    const fetch = require("node-fetch");

    let dnl = await fetch(`https://spotisongdownloader.com/api/composer/ytsearch/ytsearch.php?name=${encodeURI(name)}&artist=${encodeURI(artist)}`);

    return (await dnl.json()).videoid;
}

async function getListTrack(url) {
    const {
        JSDOM
    } = require("jsdom");
    const fetch = require("node-fetch");

    const {
        hostname,
        pathname
    } = new URL(url);
    const path = pathname.replace("/sent/", "");
    const finalUrl = `https://${hostname}${path}`;
    const response = await fetch(finalUrl);
    if (!response.ok) {
        return {
            error: `HTTP error ${response.status}`
        };
    }
    const body = await response.text();

    const dom = new JSDOM(body).window.document;

    let list = dom.querySelectorAll('meta[name="music:song"]');
    var res = [];

    for (let i of list) res.push(i.content);

    return res;
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

// Module exports

module.exports = {
    init,
    main,
    auto,
    album,
    chathook
}