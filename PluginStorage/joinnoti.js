function init() {
    return {
        "pluginName": "joinnoti",
        "pluginMain": "joinnoti.js",
        "desc": {
            "vi_VN": "Chào mừng thành viên mới vào nhóm!",
            "en_US": "Welcome new members to the group!",
        },
        "commandList": {
            "joinnoti": {
                "help": {
                    "vi_VN": "",
                    "en_US": "",
                },
                "tag": {
                    "vi_VN": "",
                    "en_US": "",
                },
                "mainFunc": "main",
                "example": {
                    "vi_VN": "",
                    "en_US": "",
                }
            }
        },
        "langMap": {
            "smsg": {
                "desc": "Test!",
                "vi_VN": "test",
                "en_US": "test",
            }
        },
        "config": {
            "first": "true",
            "auto": "true",
            "type": ".mp4"
        },
        "onLoad": "onload",
        "chathook": "send",
        "author": "Yuuki",
        "version": "0.0.1"
    }
}


async function onload() {
    const axios = require('axios');
    const fs = require('fs-extra');
    let datatype = JSON.parse(fs.readFileSync('./udata/Plugins config/joinnoti.json', 'utf-8'))
    if(datatype.first == "true") {
    const response = await axios({
        method: 'get',
        url: "https://l.facebook.com/l.php?u=https%3A%2F%2Fscontent.xx.fbcdn.net%2Fv%2Ft42.3356-2%2F429282105_6743243492448811_4673830387479179023_n.mp4%3F_nc_cat%3D102%26ccb%3D1-7%26_nc_sid%3D4f86bc%26_nc_ohc%3D1bKosvcuqYkAX8_OZgl%26_nc_ht%3Dscontent.xx%26oh%3D03_AdTJMCBoWIXZ5yxuvGGXl_WWAdvZ4-hRcNzlmP3m1cS-Kg%26oe%3D65DE0A3A%26dl%3D1&h=AT0JAnw8PgElltIC_dW0WK-8pGVS8fHLAZBAf3ngDA90kl_Q92Q9xwYxCsXpYVzZhfOgnmQ60Z7Sm8z9IY0Kb7J_wcZP9FO9gIkYUxXecNT03KWL1Nz3rizxMx7Td4fSGl_BoFF47cctPbgVKJXg9Q",
        responseType: 'stream'
    });

    let dir = path.join(__dirname, "cache", "joinnoti", "join.mp4")
    ensureExists(path.join(__dirname, "cache", "joinnoti"))
    let stream = await response.data.pipe(fs.createWriteStream(dir));
    stream.on("finish", () => { console.log("Download default joinnoti done!") })
    datatype.first = "false";
    return fs.writeFileSync('./udata/Plugins config/joinnoti.json', JSON.stringify(datatype))
}
}

async function main(data, api, adv) {

    try {
        var check = false;
        for (var i = 0; i < global.config.facebook.admin.length; i++) {
            if (global.config.facebook.admin[i] == data.senderID) {
                check = true;
            }
        }
        if (check) {
            const axios = require('axios');
            const fs = require('fs-extra');
            const path = require('path');
            if (data.args[1] == "update") {
                if (data.type != 'message_reply') return api.sendMessage("Bạn phải reply attachments!", data.threadID, data.messageID);
                if (!data.messageReply.attachments[0]) return api.sendMessage('Bạn phải reply attachments!', data.threadID, data.messageID);
                const link = data.messageReply.attachments[0].url;
                const response = await axios({
                    method: 'get',
                    url: link,
                    responseType: 'stream'
                });
                var type;
                if (data.messageReply.attachments[0].type == "video") type = ".mp4"
                if (data.messageReply.attachments[0].type == "photo") type = ".jpg"

                let dir = path.join(__dirname, "cache", "joinnoti", "join" + type)
                ensureExists(path.join(__dirname, "cache", "joinnoti"))
                let stream = await response.data.pipe(fs.createWriteStream(dir));
                stream.on("finish", () => {
                    api.sendMessage(({
                        body: "Đã thay thế attachment joinnoti!",
                        attachment: fs.createReadStream(dir)
                    }), data.threadID, data.messageID);
                });
                let datatype = JSON.parse(fs.readFileSync('./udata/Plugins config/joinnoti.json', 'utf-8'))
                datatype.type = type;
                return fs.writeFileSync('./udata/Plugins config/joinnoti.json', JSON.stringify(datatype));
            }
            if (data.args[1] == "on") {
                let datatype = JSON.parse(fs.readFileSync('./udata/Plugins config/joinnoti.json', 'utf-8'))
                datatype.auto = "true";
                api.sendMessage("Đã bật chức năng tự động chào thành viên mới vào nhóm!", data.threadID, data.messageID);
                return fs.writeFileSync('./udata/Plugins config/joinnoti.json', JSON.stringify(datatype))
            }


            if (data.args[1] == "off") {
                let datatype = JSON.parse(fs.readFileSync('./udata/Plugins config/joinnoti.json', 'utf-8'))
                datatype.auto = "false";
                api.sendMessage("Đã tắt chức năng tự động chào thành viên mới vào nhóm!", data.threadID, data.messageID);
                return fs.writeFileSync('./udata/Plugins config/joinnoti.json', JSON.stringify(datatype))
            }
            api.sendMessage("Vui lòng chọn [update || on || off]", data.threadID, data.messageID);
        } else { return api.sendMessage("No permission!", data.threadID, data.messageID) }
    } catch (error) {
        console.log(error);
    }

}

async function send(data, api, adv) {
    const fs = require('fs-extra');
    let datatype = JSON.parse(fs.readFileSync('./udata/Plugins config/joinnoti.json', 'utf-8'))
    if (datatype.auto == "false") return;
    if (data.type != 'event') return;
    if (data.logMessageType != "log:subscribe") return;
    for (id in data.logMessageData.addedParticipants) {
        const username = data.logMessageData.addedParticipants[id].fullName;
        var count = data.participantIDs.length;
        const rest = await api.getThreadInfo(data.threadID);
        var msg = {
            body: "🌸Chào mừng " + username + " đã đến với " + rest.threadName + ". Bạn là thành viên thứ " + count + " của nhóm!\nChúc bạn một ngày vui vẻ, nhớ tôn trọng mọi người trong nhóm nhé!✨",
            attachment: fs.createReadStream(__dirname + '/cache/joinnoti/join' + datatype.type)
        }
        api.sendMessage(msg, data.threadID);
    }
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
    onload,
    main,
    send,
    init
}
