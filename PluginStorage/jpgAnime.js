function init() {
    return {
        "pluginName": "JPG Anime",
        "pluginMain": "jpgAnime.js",
        "commandList": {
            "anime": {
                "help": {
                    "vi_VN": "<Bomb> || <BDSM> || <Maid> || <Hentai>",
                    "en_US": "<Bomb> || <BDSM> || <Maid> || <Hentai>"
                },
                "tag": {
                    "vi_VN": "Cho bạn 1 tấm ảnh Anime cute UwU",
                    "en_US": "Show you a cute Anime photo UwU"
                },
                "mainFunc": "main"
            }
        },
        "nodeDepends": {
            "akaneko": ""
        },
        "langMap": {

        },
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

function main(data, api) {
    //console.log(data);
    const path = require("path");
    ensureExists(path.join(__dirname, "cache"));
    ensureExists(path.join(__dirname, "cache", "jpgAnime"));

    switch ((data.args[1]+"").toLowerCase()) {
        case "bomb": {
            bomb(data, api);
            break;
        }
        case "bdsm": {
            bdsm(data, api);
            break;
        }
        case "maid": {
            maid(data, api);
            break;
        }
        case "hentai": {
            hentai(data, api);
            break;
        }
        default: {
            api.sendMessage("Wrong command. Use: "+global.config.facebook.prefix+"anime <Neko> || <Bomb> || <BDSM> || <Maid> || <Hentai>\n- Ex: "+global.config.facebook.prefix+"anime neko", data.threadID, data.messageID);
            break;
        }
    }
}

async function neko(data, api) {
    const akaneko = require('akaneko');
    const path = require("path");
    const streamBuffers = require("stream-buffers");
    
    var fetch = require("node-fetch");
    let link = await akaneko.neko();
    console.log(link);

    var fetchimage = await fetch(link);
    var buffer = await fetchimage.buffer();
    var imagesx = new streamBuffers.ReadableStreamBuffer({
        frequency: 10,
        chunkSize: 1024
    });
    imagesx.path = path.join(__dirname, "cache", "jpgAnime", data.messageID+".jpg");
    imagesx.put(buffer);
    imagesx.stop();

    api.sendMessage({ attachment: [imagesx] }, data.threadID, data.messageID);
}

async function bomb(data, api) {
    const akaneko = require('akaneko');
    const path = require("path");
    const streamBuffers = require("stream-buffers");
    
    var fetch = require("node-fetch");
    let link = await akaneko.lewdBomb(1);
    console.log(link);

    var fetchimage = await fetch(link);
    var buffer = await fetchimage.buffer();
    var imagesx = new streamBuffers.ReadableStreamBuffer({
        frequency: 10,
        chunkSize: 1024
    });
    imagesx.path = path.join(__dirname, "cache", "jpgAnime", data.messageID+".jpg");
    imagesx.put(buffer);
    imagesx.stop();

    api.sendMessage({ attachment: [imagesx] }, data.threadID, data.messageID);
}

async function bdsm(data, api) {
    const akaneko = require('akaneko');
    const path = require("path");
    const streamBuffers = require("stream-buffers");
    
    var fetch = require("node-fetch");
    let link = await akaneko.nsfw.bdsm();
    console.log(link);

    var fetchimage = await fetch(link);
    var buffer = await fetchimage.buffer();
    var imagesx = new streamBuffers.ReadableStreamBuffer({
        frequency: 10,
        chunkSize: 1024
    });
    imagesx.path = path.join(__dirname, "cache", "jpgAnime", data.messageID+".jpg");
    imagesx.put(buffer);
    imagesx.stop();

    api.sendMessage({ attachment: [imagesx] }, data.threadID, data.messageID);
}

async function maid(data, api) {
    const akaneko = require('akaneko');
    const path = require("path");
    const streamBuffers = require("stream-buffers");
    
    var fetch = require("node-fetch");
    let link = await akaneko.nsfw.maid();
    console.log(link);

    var fetchimage = await fetch(link);
    var buffer = await fetchimage.buffer();
    var imagesx = new streamBuffers.ReadableStreamBuffer({
        frequency: 10,
        chunkSize: 1024
    });
    imagesx.path = path.join(__dirname, "cache", "jpgAnime", data.messageID+".jpg");
    imagesx.put(buffer);
    imagesx.stop();

    api.sendMessage({ attachment: [imagesx] }, data.threadID, data.messageID);
}

async function hentai(data, api) {
    const akaneko = require('akaneko');
    const path = require("path");
    const streamBuffers = require("stream-buffers");
    
    var fetch = require("node-fetch");
    let link = await akaneko.nsfw.hentai();
    console.log(link);

    var fetchimage = await fetch(link);
    var buffer = await fetchimage.buffer();
    var imagesx = new streamBuffers.ReadableStreamBuffer({
        frequency: 10,
        chunkSize: 1024
    });
    imagesx.path = path.join(__dirname, "cache", "jpgAnime", data.messageID+".jpg");
    imagesx.put(buffer);
    imagesx.stop();

    api.sendMessage({ attachment: [imagesx] }, data.threadID, data.messageID);
}

function ensureExists(path, mask) {
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
    main
}