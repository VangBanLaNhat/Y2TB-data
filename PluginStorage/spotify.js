function init(){ 
     return{ 
         "pluginName": "Facebook", 
         "pluginMain": "Facebook.js", 
         "desc": { 
             "vi_VN": "", 
             "en_US": "" 
         }, 
         "commandList": { 
             "fbdl": { 
                 "help": { 
                     "vi_VN": "<Link video Facebook>", 
                     "en_US": "<Link video Facebook>" 
                 }, 
                 "tag": { 
                     "vi_VN": "Tải video từ Facebook", 
                     "en_US": "Download video from Facebook" 
                 }, 
                 "mainFunc": "main", 
                 "example": { 
                     "vi_VN": "", 
                     "en_US": "" 
                 } 
             },
            "fbauto": { 
                 "help": { 
                     "vi_VN": "", 
                     "en_US": "" 
                 }, 
                 "tag": { 
                     "vi_VN": "Tự động tải về video từ Facebook", 
                     "en_US": "Automatically download video Facebook" 
                 }, 
                 "mainFunc": "fbauto", 
                 "example": { 
                     "vi_VN": "", 
                     "en_US": "" 
                 } 
             },
         }, 
         "chathook": "autoDown", 
        "langMap":{ 
             "nolink":{ 
                 "desc": "Send went no input", 
                 "vi_VN": "Vui lòng nhập link video Facebook!", 
                 "en_US": "Please enter the Facebook video link!", 
                 "args": {} 
             }, 
             "Done":{ 
                 "desc": "Done", 
                 "vi_VN": "Hoàn tất: {title}", 
                 "en_US": "Done: {title}", 
                 "args": {} 
             },
            "autoOn": { 
                 "desc": "Turn Facebook Auto Download", 
                 "vi_VN": "Đã bật Facebook Auto Download tại thread này.", 
                 "en_US": "Turn on Facebook Auto Download at this thread.", 
                 "args": {}, 
            },
             "autoOff": { 
                 "desc": "Turn off Facebook Auto Download", 
                 "vi_VN": "Đã tắt Facebook Auto Download tại thread này.", 
                 "en_US": "Turn off Facebook Auto Download at this thread.", 
                 "args": {} 
             }, 
             "noPer":{ 
                "desc": "No permission", 
                 "vi_VN": "Không đủ quyền!", 
                 "en_US": "No permission!", 
                 "args": {} 
            }
         },
         "nodeDepends":{
             "axios": ""
         }, 
         "author": "HerokeyVN", 
         "version": "0.0.1" 
     } 
 }
 
async function main(data, api, adv, link){
    const axios = require('axios');
    const fs = require("fs");
    const path = require("path");

    const options = {
        method: 'GET',
        url: 'https://facebook-reel-and-video-downloader.p.rapidapi.com/app/main.php',
        params: {
            url: link ? link:data.args[1]
        },
        headers: {
            'X-RapidAPI-Key': '2e9fbfc6f2mshd1b65f21dae9376p1b616fjsnc26e55b4f55d',
            'X-RapidAPI-Host': 'facebook-reel-and-video-downloader.p.rapidapi.com'
        }
    };
    
    try {
    	const info = await axios.request(options);
    	//console.log(info.data);
    	
    	if(info.data.error && link) return; 
    	
    	if(info.data.error) return api.sendMessage(info.data.error, data.threadID, data.messageID); 
    	const response = await axios({ 
             method: 'get', 
             url: info.data.links["Download High Quality"], 
             responseType: 'stream' 
         });
         
         let time = (new Date()).getTime();
  
         let dir = path.join(__dirname, "cache", "fbdl", data.messageID+time+".mp4") 
         ensureExists(path.join(__dirname, "cache", "fbdl")) 
  
         let stream = response.data.pipe(fs.createWriteStream(dir)); 
         let map = { 
                 "{title}": info.data.title
         } 
         stream.on("finish", () => { 
             api.sendMessage(({ 
  
                 body: adv.replaceMap(adv.rlang("Done"), map), 
                 attachment: fs.createReadStream(dir) 
             }), data.threadID, ()=>fs.unlinkSync(dir), data.messageID); 
         });
    } catch (error) {
        if (link) return;
        api.sendMessage(error, data.threadID, data.messageID); 
    	console.error(error);
    }
}

async function fbauto(data, api, {rlang, replaceMap, getThreadInfo}) { 
    if(global.config.facebook.admin.indexOf(data.senderID) == -1) { 
         let adminL = (await getThreadInfo(data.threadID)).adminIDs; 
         let check = false; 
         for(let i of adminL) if(i.id == data.senderID) { 
             check = true; break; 
         }  
         if(!check) return api.sendMessage(rlang("noPer"), data.threadID, data.messageID); 
     } 
     if(global.data.facebook.autodown[data.threadID]) {
         global.data.facebook.autodown[data.threadID] = false;
         return api.sendMessage(rlang("autoOff"), data.threadID, data.messageID);
     }
  
     global.data.facebook.autodown[data.threadID] = true;
     api.sendMessage(rlang("autoOn"), data.threadID, data.messageID); 
 }

async function autoDown(data, api, adv) {
    !global.data.facebook ? global.data.facebook = {}:"";
    !global.data.facebook.autodown ? global.data.facebook.autodown = 
    {}:"";
    global.data.facebook.autodown[data.threadID] == undefined ? global.data.facebook.autodown[data.threadID] = true:"";
    
    if((data.type != "message" && data.type != "message_reply") || !global.data.facebook.autodown[data.threadID] || data.body.indexOf(global.config.facebook.prefix) == 0) return;
    
    let mapLink = ["fb.com", "facebook.com", "fb.watch"];
    
    let args = data.body.split(" ");
    
    for(let i of args) {
        let ch = false;
        for(let j of mapLink) if(i.indexOf(j) != -1) {
            ch = true;
            break;
        }
        
        if(!ch) return;
        
        main(data, api, adv, i);
        await new Promise((t)=>setTimeout(t, 1000));
    }
}

function nul(){}

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
    fbauto,
    autoDown
}