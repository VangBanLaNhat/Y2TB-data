var fs = require("fs");
var path = require("path");

function init(){
    return{
        "pluginName": "QRcode",
        "pluginMain": "QRcode.js",
        "desc": {
            "vi_VN": "Quét và tạo mã QR",
            "en_US": "Scan and generate QR code"
        },
        "commandList": {
            "qr": {
                "help": {
                    "vi_VN": "<create||scan>",
                    "en_US": "<create||scan>"
                },
                "tag": {
                    "vi_VN": "Tạo/quét mã QR",
                    "en_US": "Create/scan QR code"
                },
                "mainFunc": "main",
                "example": {
                    "vi_VN": "qr create burk burk lmao",
                    "en_US": "qr create Hello"
                }
            }
        },
        "langMap":{
            "nomsg": {
                "desc": "Undefined message",
                "vi_VN": "Vui lòng nhập nội dung!",
                "en_US": "Please enter content!",
                "args": {}
            },
            "noreply": {
                "desc": "No reply",
                "vi_VN": "Vui lòng reply mã QR!",
                "en_US": "Please reply QR code!",
                "args": {}
            },
            "notqr": {
                "desc": "Not QRcode",
                "vi_VN": "Đó không phải là mã QR!",
                "en_US": "It is't QR code!",
                "args": {}
            },
        },
        "obb": "QRcode",
        "nodeDepends":{
        },
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

function main(data, api){
    switch (data.args[1]) {
        case 'create':
            crqr(data, api);
            break;
        case 'scan':
            dcqr(data, api);
            break;
        default:
            api.sendMessage(`<create||scan>`, data.threadID, data.messageID);
            break;
    }
}

async function crqr(data, api){
    //var QRCode = require("qrcode");
    var axios = require("axios");
    var lang = global.lang.QRcode;
    var msg = data.args.slice(2).join(" ");
    if(msg){
        try{
            //var link = await QRCode.toDataURL(msg, {type:'terminal'});
            var link = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(msg)}&size=1000x1000`
            console.log(link)
            var rt = {
                body: "Success:",
                attachment: (await axios({
                    url: link,
                    method: "GET", 
                    responseType: "stream"
                })).data
            }
            api.sendMessage(rt, data.threadID, data.messageID);
        } catch (e){
            api.sendMessage(e, data.threadID, data.messageID);
            console.error("QRcode", e)
        }
    }else{
        api.sendMessage(lang.nomsg[global.config.bot_info.lang] , data.threadID, data.messageID);
    }
}

async function dcqr(data, api){
    //var quirc = require("node-quirc");
    var axios = require("axios");
    
    var lang = global.lang.QRcode;
    if (data.messageReply) if(data.messageReply.attachments[0].url){
        try{
            var link = data.messageReply.attachments[0].url;
            
            /*var imgdl = (await axios({
                url: link,
                method: "GET",
                responseType: "stream"
            })).data
            var imgdl = require('sync-request')("GET", link).body;
            fs.writeFileSync(path.join(dircc, data.messageID + ".jpg"), imgdl);
            var img = fs.readFileSync(path.join(dircc, data.messageID + ".jpg"));*/
            try{
                //var rt = await quirc.decode(img);
                var rt = (await axios(`http://zxing.org/w/decode?u=${encodeURIComponent(link)}&full=true%20(code%20URL%20unescaped:%20${encodeURIComponent(link)})`)).data
                api.sendMessage("Scan completed: "+rt, data.threadID, data.messageReply.messageID)
            } catch (e){
                api.sendMessage(lang.notqr[global.config.bot_info.lang], data.threadID, data.messageReply.messageID)
                console.error("QRcode", e)
            }
            
        } catch (e){
            api.sendMessage(e, data.threadID, data.messageID);
            console.error("QRcode", e)
        }
    } else api.sendMessage(lang.notqr[global.config.bot_info.lang] , data.threadID, data.messageID)
    else api.sendMessage(lang.noreply[global.config.bot_info.lang] , data.threadID, data.messageID);
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