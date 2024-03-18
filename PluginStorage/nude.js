function init(){
    return{
        "pluginName": "18+ Images",
        "pluginMain": "nude.js",
        "desc": {
            "vi_VN": "Cho bạn ngẫu nhiên 1 tấm ảnh 18+",
            "en_US": "Randomly give you 1 photo 18+"
        },
        "commandList": {
            "nude": {
                "help": {
                    "vi_VN": "",
                    "en_US": ""
                },
                "tag": {
                    "vi_VN": "PingCho bạn ngẫu nhiên 1 tấm ảnh 18+",
                    "en_US": "Randomly give you 1 photo 18+"
                },
                "mainFunc": "main",
                "example": {
                    "vi_VN": "nude",
                    "en_US": "nude"
                }
            }
        },
        "nodeDepends":{
        	"random": "3.0.6",
        	"stream-buffers":""
        },
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

/*async function neko(data, api) {
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
}*/

async function main(data, api){
    const path = require("path");
    const streamBuffers = require("stream-buffers");
    const fetch = require("node-fetch");
    const random = require("random");
    const Api = "https://raw.githubusercontent.com/HerokeyVN/API_Date/main/18plus.json";
    ensureExists(path.join(__dirname, "cache", "nude"));
    
    let json = await fetch(Api);
    json = await json.json();
    
    let link = json[random.int(0, json.length-1)];
    
    let fetchimage = await fetch(link);
    let buffer = await fetchimage.buffer();
    let imagesx = new streamBuffers.ReadableStreamBuffer({
        frequency: 10,
        chunkSize: 1024
    });
    imagesx.path = path.join(__dirname, "cache", "nude", data.messageID+".jpg");
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
    main,
    init
};
