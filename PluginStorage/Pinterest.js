function init() {
    return {
        "pluginName": "Pinterest",
        "pluginMain": "Pinterest.js",
        "desc": {
            "vi_VN": "Tải media từ Pinterest",
            "en_US": "Download Media from Pinterest"
        },
        "commandList": {
            "pintdl": {
                "help": {
                    "vi_VN": "<Link Pinterest>",
                    "en_US": "<Link Pinterest>"
                },
                "tag": {
                    "vi_VN": "Tải media từ Pinterest",
                    "en_US": "Download Media from Pinterest"
                },
                "mainFunc": "main",
                "example": {
                    "vi_VN": "pintdl https://www.pinterest.com/pin/563018696644092/",
                    "en_US": "pintdl https://www.pinterest.com/pin/563018696644092/"
                }
            },
            "autopint": {
                "help": {
                    "vi_VN": "",
                    "en_US": ""
                },
                "tag": {
                    "vi_VN": "Bật/Tắt tự dộng tải xuống link Pinterest",
                    "en_US": "Turn on/off automatically download the Pinterest link"
                },
                "mainFunc": "auto",
                "example": {
                    "vi_VN": "autopint",
                    "en_US": "autopint"
                }
            }
        },
        "langMap":{
            "sendBody": {
                "desc": "Message sent when downloaded complete",
                "vi_VN": "{0}",
                "en_US": "{0}",
                "args": {
                    "{0}": {
                        "vi_VN": "Tiêu đề",
                        "en_US": "Title"
                    },
                    "{1}": {
                        "vi_VN": "Mô tả",
                        "en_US": "Describe"
                    }
                }
            },
            "On":{
                "desc": "Turn on auto download",
                "vi_VN": "Đã bật tự động tải link Pinterest tại đây.",
                "en_US": "Automatically download the Pinterest link here.",
                "args": {}
            },
            "Off":{
                "desc": "Turn off auto download",
                "vi_VN": "Đã tắt tự động tải link Pinterest tại đây.",
                "en_US": "Turn off automatically download Pinterest link here.",
                "args": {}
            }, 
            "noPer":{ 
               "desc": "No permission", 
                "vi_VN": "Không đủ quyền!", 
                "en_US": "No permission!", 
                "args": {} 
           }
        },
        "nodeDepends": {
            "jsdom": "22.1.0",
        },
        "chathook": "chathook",
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

async function main(data, api, adv, chk) {
    const axios = require("axios");
    
    let link = chk ? await getLink(chk) : await getLink(data.args[1]);

    if (link.error) {
        console.error("Pinterest", link.error);
        return !chk ? api.sendMessage(link.error, data.threadID, data.messageID) : "";
    }

    let stream = (await axios({
        url: link.url,
        method: "GET",
        responseType: "stream"
    })).data

    //console.log(link);

    api.sendMessage({
        body: adv.replaceMap(adv.rlang("sendBody"), {
            "{0}": link.title,
            "{1}": link.desc
        }),
        attachment: stream
    }, data.threadID, data.messageID);
}

async function auto(data, api, {rlang, getThreadInfo}) {
    if(global.config.facebook.admin.indexOf(data.senderID) == -1) { 
        let adminL = (await getThreadInfo(data.threadID)).adminIDs; 
        let check = false; 
        for(let i of adminL) if(i.id == data.senderID) { 
            check = true; break; 
        }  
        if(!check) return api.sendMessage(rlang("noPer"), data.threadID, data.messageID); 
    } 
    if(global.data.pinterest[data.threadID]) {
        global.data.pinterest[data.threadID] = false;
        return api.sendMessage(rlang("Off"), data.threadID, data.messageID);
    }
 
    global.data.pinterest[data.threadID] = true;
    api.sendMessage(rlang("On"), data.threadID, data.messageID); 
}

async function chathook(data, api, adv) {
    !global.data.pinterest ? global.data.pinterest = {}:"";
    global.data.pinterest[data.threadID] == undefined ? global.data.pinterest[data.threadID] = true:"";

    if((data.type != "message" && data.type != "message_reply") || !global.data.pinterest[data.threadID] || data.body.indexOf(global.config.facebook.prefix) == 0) return;
    
    let mapLink = ["pin.it", "pinterest.com"];
    
    let args = data.body.split(" ");
    
    for(let i of args) {
        let ch = false;
        for(let j of mapLink) if(i.indexOf(j) != -1) {
            ch = true;
            break;
        }
        
        if(!ch) break;
        
        main(data, api, adv, i);
    }
}

async function getLink(link) {
    const { JSDOM } = require("jsdom");
    const fetch = require("node-fetch");

    var url = link;

    try {
        if (url.match("pin.it")) url = await expandURL(url);

        const { hostname, pathname } = new URL(url);
        const path = pathname.replace("/sent/", "");
        const finalUrl = `https://${hostname}${path}`;
        const response = await fetch(finalUrl);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const body = await response.text();
        let outUrl;
        let type = "video";
        try {
            const video = new JSDOM(body).window.document.getElementsByTagName(
                "video"
            )[0].src;
            outUrl = video.replace("/hls/", "/720p/").replace(".m3u8", ".mp4");
        } catch (_) {
            outUrl = new JSDOM(body).window.document.getElementsByTagName(
                "img"
            )[0];
            if (!outUrl) return {error: "The link does not exist, please try again with a new link!"};
            outUrl = outUrl.src;
            type = "image";
        }

        const title = new JSDOM(body).window.document.querySelector('div[data-test-id="pinTitle"] h1').innerHTML;
        var desc;
        try {
            desc = new JSDOM(body).window.document.querySelector('div[data-test-id="truncated-description"] div div span').innerHTML;
        } catch (_) {}

        //console.log(desc);

        return {
            type: type,
            url: outUrl,
            title: title,
            decs: desc
        };
    } catch (err) {
        return {
            error: err
        };
    }
}

async function expandURL(shortenURL) {
    const uri = new URL(shortenURL);
    const path = uri.pathname;
    const finalUrl = `https://api.pinterest.com/url_shortener${path}/redirect/`;
    try {
        let response = await fetch(finalUrl, {
            method: "HEAD",
            redirect: "manual",
        });
        let location = response.headers.get("location");
        return location;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    init,
    main,
    auto,
    chathook
}