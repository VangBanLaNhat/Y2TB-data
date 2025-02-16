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
            "type": ".mp4", 
            "urldf": "https://v16m-default.tiktokcdn-us.com/39e8e787e9d73447d3a86172617f6ef2/67b08940/video/tos/alisg/tos-alisg-pve-0037c001/ooiQFDFzuAtuA4GQixNU9IiAo8yfEz9NC5awIB/?a=0&bti=OHYpOTY0Zik3OjlmOm01MzE6ZDQ0MDo%3D&ch=0&cr=13&dr=0&er=0&lr=all&net=0&cd=0%7C0%7C0%7C&cv=1&br=2492&bt=1246&cs=0&ds=6&ft=Wg2pvNM6VUOwU0mr1arz7Er5SEBVSBPXtg58vlcyqF_4&mime_type=video_mp4&qs=0&rc=MzhoMzk4ZDhlNWdlOzwzNUBpM3JwbWs5cjY7dzMzODczNEBfYl42LTQ0NjUxLjI1MjUyYSNhcWNwMmRjZG1gLS1kMS1zcw%3D%3D&vvpl=1&l=202502150631374B6479AA734D4623D534&btag=e000b8000"
        },
        // "onload": "onload",
        "chathook": "send",
        "author": "Yuuki",
        "version": "0.0.1"
    }
}


async function onload() {
    const axios = require('axios');
    const fs = require('fs-extra');
    const path = require('path');
    let datatype = JSON.parse(fs.readFileSync('./udata/Plugins config/joinnoti.json', 'utf-8'))
    if (datatype.first == "true") {
        const response = await axios({
            method: 'get',
            url: datatype.urldf,
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
                let datatypee = JSON.parse(fs.readFileSync('./udata/Plugins config/joinnoti.json', 'utf-8'))
                datatypee.urldf = link;
                fs.writeFileSync('./udata/Plugins config/joinnoti.json', JSON.stringify(datatypee))
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
    // try {
    //     const uidBot = api.getCurrentUserID();
    //     const uida = data.logMessageData.addedParticipants[0].userFbId
    //     if (uida == uidBot) {
    //         api.changeNickname(`[ ${global.config.facebook.prefix} ] • ${(global.config.bot_info.botname)}`, data.threadID, api.getCurrentUserID());
    //         return api.sendMessage(`Connected successfully! `, data.threadID);
    //     }
    // } catch {
    //     // console.log("")
    // }

    const fs = require('fs-extra');
    let datatype = JSON.parse(fs.readFileSync('./udata/Plugins config/joinnoti.json', 'utf-8'))
    if (datatype.auto == "false") return;
    if (data.type != 'event') return;
    if (data.logMessageType != "log:subscribe") return;

    // api.sendMessage(data.logMessageType, data.threadID)
    console.log(data.logMessageData.addedParticipants)
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
    // onload,
    main,
    send,
    init
}
