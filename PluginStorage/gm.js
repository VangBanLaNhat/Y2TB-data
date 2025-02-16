const { error } = require("npmlog");

function init() {
    return {
        "pluginName": "group manager",
        "pluginMain": "gm.js",
        "desc": {
            "vi_VN": "Test",
            "en_US": "Test"
        },
        "commandList": {
            "changeNickName": {
                "help": {
                    "vi_VN": "test",
                    "en_US": "test"
                },
                "tag": {
                    "vi_VN": "test",
                    "en_US": "test"
                },
                "mainFunc": "changeNickName",
                "example": {
                    "vi_VN": "test",
                    "en_US": "test"
                }
            },

            "changeGroupName": {
                "help": {
                    "vi_VN": "test",
                    "en_US": "test"
                },
                "tag": {
                    "vi_VN": "test",
                    "en_US": "test"
                },
                "mainFunc": "changeGroupName",
                "example": {
                    "vi_VN": "test",
                    "en_US": "test"
                }
            },

            "changeGroupImage": {
                "help": {
                    "vi_VN": "test",
                    "en_US": "test"
                },
                "tag": {
                    "vi_VN": "test",
                    "en_US": "test"
                },
                "mainFunc": "changeGroupImage",
                "example": {
                    "vi_VN": "test",
                    "en_US": "test"
                }
            },

            "changeGroupEmoji": {
                "help": {
                    "vi_VN": "test",
                    "en_US": "test"
                },
                "tag": {
                    "vi_VN": "test",
                    "en_US": "test"
                },
                "mainFunc": "changeGroupEmoji",
                "example": {
                    "vi_VN": "test",
                    "en_US": "test"
                }
            },

            "kick": {
                "help": {
                    "vi_VN": "test",
                    "en_US": "test"
                },
                "tag": {
                    "vi_VN": "test",
                    "en_US": "test"
                },
                "mainFunc": "removeUser",
                "example": {
                    "vi_VN": "test",
                    "en_US": "test"
                }
            },

            "qtv": {
                "help": {
                    "vi_VN": "test",
                    "en_US": "test"
                },
                "tag": {
                    "vi_VN": "test",
                    "en_US": "test"
                },
                "mainFunc": "addAdmin",
                "example": {
                    "vi_VN": "test",
                    "en_US": "test"
                }
            },

        },
        "nodeDepends": {
            "emoji-regex": ""
        },
        "langMap": {
            "translation code 1": {
                "desc": "Describe the function of translation",
                "vi_VN": "Translation in Vietnamese {0}",
                "en_US": "Translation in English {0}",
                "args": {
                    "{0}": {
                        "vi_VN": "Describe the function of the variable in Vietnamese",
                        "en_US": "Describe the function of the variable in English"
                    }
                }
            },
            "translation code 2": {
                "desc": "Describe the function of translation",
                "vi_VN": "Translation in Vietnamese {1}",
                "en_US": "Translation in English {1}",
                "args": {
                    "{1}": {
                        "vi_VN": "Describe the function of the variable in Vietnamese",
                        "en_US": "Describe the function of the variable in English"
                    }
                }
            }
        },
        "config": {
            "config 1": "value 1",
            "config 2": "value 2"
        },
        "chathook": "np",
        // "onload": "onload", //function will be run during plugin load
        // "loginFunc": "login", //Function will be called on successful Facebook loginFunc
        // "obb": "The required directory name for the plugin is in /plugins/obb",
        "author": "ReineOwO",
        "version": "0.0.1"
    }
}


async function changeNickName(data, api) {
    const newArgs = data.args.slice(1);
    const name = newArgs.join(" "); // 
    const mention = Object.keys(data.mentions)[0]; // Lấy ID người được mention đầu tiên

    try {
        if (!mention) { // Nếu không có mention
            await api.changeNickname(name, data.threadID, data.senderID);
            api.sendMessage("Đã đổi nickname của bạn thành " + name, data.threadID);
        } else { // Nếu có mention
            const newName = name.replace(data.mentions[mention].name || data.mentions[mention], "");
            await api.changeNickname(newName.trim(), data.threadID, mention);
            api.sendMessage(`Đã đổi biệt danh của ${data.mentions[mention].name || data.mentions[mention]} thành: ${newName.trim()}`, data.threadID);
        }
    } catch (error) {
        console.error("Lỗi đổi nickname:", error);
        api.sendMessage("Có lỗi xảy ra khi đổi nickname. Vui lòng thử lại sau.", data.threadID);
    }
}


async function changeGroupName(data, api, adv) {
    const newArgs = data.args.slice(1);
    const name = newArgs.join(" "); // 
    try {
        await api.setTitle(name, data.threadID);
        api.sendMessage(`Đã đổi tên nhóm thành: ${name}`, data.threadID)
    } catch (error) {
        api.sendMessage("Có lỗi xảy ra khi đổi tên nhóm. Vui lòng thử lại sau.", data.threadID);
    }
}


async function changeGroupImage(data, api, adv) {
    const axios = require('axios');
    const fs = require('fs-extra');
    const path = require('path');
    if (data.type != 'message_reply') return api.sendMessage("Bạn phải reply ảnh!", data.threadID, data.messageID);
    if (!data.messageReply.attachments[0]) return api.sendMessage('Bạn phải reply ảnh!', data.threadID, data.messageID);
    if (data.messageReply.attachments[0].type == "video") return api.sendMessage('Bạn phải reply ảnh!', data.threadID, data.messageID);
    const link = data.messageReply.attachments[0].url;
    try {
        const response = await axios({
            method: 'get',
            url: link,
            responseType: 'stream'
        });

        let dir = path.join(__dirname, "cache", "changeGroupImage", "join" + ".jpg")
        ensureExists(path.join(__dirname, "cache", "changeGroupImage"))
        let stream = await response.data.pipe(fs.createWriteStream(dir));
        stream.on("finish", () => {
            api.changeGroupImage(fs.createReadStream(dir), data.threadID);
            api.sendMessage("Đã thay đổi ảnh nhóm!", data.threadID)
        })
    } catch (error) {
        api.sendMessage("Có lỗi xảy ra khi đổi ảnh nhóm. Vui lòng thử lại sau.", data.threadID);
    }
}


async function changeGroupEmoji(data, api, adv) {
    const emoji = data.args[1];

    if (!emoji) {
        return api.sendMessage("Vui lòng nhập emoji muốn đổi!", data.threadID, data.messageID);
    }

    try {
        const result = await api.changeThreadEmoji(emoji, data.threadID);
        console.log("Kết quả đổi emoji:", result);
        return api.sendMessage("Đã thay đổi emoji của nhóm thành: " + emoji, data.threadID);
    } catch (error) {
        console.error("Lỗi đổi emoji:", error);
        return api.sendMessage("Có lỗi xảy ra khi đổi emoji nhóm. Vui lòng nhập đúng emoji cần đổi.", data.threadID);
    }
}

async function removeUser(data, api, adv) {
    let res = await api.getThreadInfo(data.threadID)
    let isAdmin = false;
    console.log(res)
    if (res && res.adminIDs && Array.isArray(res.adminIDs)) {
        for (let i = 0; i < res.adminIDs.length; i++) {
            const adminID = res.adminIDs[i].id;
            if (adminID == api.getCurrentUserID()) {
                isAdmin = true;
                break;
            }
        }
    } else {
        console.error("Lỗi: Không có thông tin thread hoặc adminIDs.", res);

        return api.sendMessage("Lỗi: Không thể lấy thông tin nhóm.", data.threadID);
    }


    if (!isAdmin) {
        return api.sendMessage("Bot không có quyền quản trị viên để thực hiện lệnh này. Vui lòng thêm bot làm quản trị viên rồi thử lại.", data.threadID, data.messageID);
    }

    const mention = Object.keys(data.mentions)[0];

    if (!mention) {
        return api.sendMessage("Vui lòng tag người bạn muốn kick.", data.threadID, data.messageID);
    }

    try {
        await api.removeUserFromGroup(mention, data.threadID);
        api.sendMessage(`Đã xóa ${data.mentions[mention].name || data.mentions[mention] || "người dùng"} khỏi nhóm!`, data.threadID);
    } catch (error) {
        console.error("Lỗi kick:", error);
        api.sendMessage("Có lỗi xảy ra khi kick. Vui lòng thử lại sau. Lỗi: " + error.message, data.threadID);
    }
}


async function addAdmin(data, api, adv) {
    let res = await api.getThreadInfo(data.threadID)
    let isAdmin = false;
    console.log(res)
    if (res && res.adminIDs && Array.isArray(res.adminIDs)) {
        for (let i = 0; i < res.adminIDs.length; i++) {
            const adminID = res.adminIDs[i].id;
            if (adminID == api.getCurrentUserID()) {
                isAdmin = true;
                break;
            }
        }
    } else {
        console.error("Lỗi: Không có thông tin thread hoặc adminIDs.", res);

        return api.sendMessage("Lỗi: Không thể lấy thông tin nhóm.", data.threadID);
    }


    if (!isAdmin) {
        return api.sendMessage("Bot không có quyền quản trị viên để thực hiện lệnh này. Vui lòng thêm bot làm quản trị viên rồi thử lại.", data.threadID, data.messageID);
    }

    const status = data.args[1];
    const mention = Object.keys(data.mentions)[0];

    if (!mention) {
        return api.sendMessage("Vui lòng tag người bạn muốn thay đổi quyền admin.", data.threadID, data.messageID);
    }

    if (status == "add") {

        let isAdmina = false;
        console.log(res)
        if (res && res.adminIDs && Array.isArray(res.adminIDs)) {
            for (let i = 0; i < res.adminIDs.length; i++) {
                const adminID = res.adminIDs[i].id;
                if (adminID == mention) {
                    isAdmina = true;
                    break;
                }
            }
        } else {
            console.error("Lỗi: Không có thông tin thread hoặc adminIDs.", res);

            return api.sendMessage("Lỗi: Không thể lấy thông tin nhóm.", data.threadID);
        }
        if (isAdmina) {
            return api.sendMessage("Người này hiện đã là QTV!", data.threadID, data.messageID);
        } else {
            try {
                await api.changeAdminStatus(data.threadID, mention, true)
                api.sendMessage(`Đã thêm ${data.mentions[mention].name || data.mentions[mention] || "người dùng"} làm QTV!`, data.threadID);
            } catch (error) {
                api.sendMessage("Không thể thêm QTV, đã có lỗi xảy ra!", data.threadID)
            }
        }
    }


    if (status == "remove") {

        let isAdmina = false;
        console.log(res)
        if (res && res.adminIDs && Array.isArray(res.adminIDs)) {
            for (let i = 0; i < res.adminIDs.length; i++) {
                const adminID = res.adminIDs[i].id;
                if (adminID == mention) {
                    isAdmina = true;
                    break;
                }
            }
        } else {
            console.error("Lỗi: Không có thông tin thread hoặc adminIDs.", res);

            return api.sendMessage("Lỗi: Không thể lấy thông tin nhóm.", data.threadID);
        }
        if (!isAdmina) {
            return api.sendMessage("Người này hiện không là QTV!", data.threadID, data.messageID);
        } else {
            try {
                await api.changeAdminStatus(data.threadID, mention, false)
                api.sendMessage(`Đã xóa quyền QTV, ${data.mentions[mention].name || data.mentions[mention] || "người dùng"} trở thành người bình thường!`, data.threadID);
            } catch (error) {
                api.sendMessage("Không thể xóa QTV, đã có lỗi xảy ra!", data.threadID)
            }
        }
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

async function np(data, api, adv) {
    if (data.type == "read_receipt") { return }
    if (data.type == "typ") { return }
    console.log(data)

}



module.exports = {
    // cmd2,
    np,
    // onload,
    // login,
    init,
    changeNickName,
    changeGroupName,
    changeGroupImage,
    changeGroupEmoji,
    removeUser, 
    addAdmin
};