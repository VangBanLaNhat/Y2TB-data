const { error } = require("npmlog");

function init() {
    return {
        "pluginName": "adduser",
        "pluginMain": "adduser.js",
        "desc": {
            "vi_VN": "Thêm thành viên bằng url hoặc uid facebook",
            "en_US": "Add member by url or facebook uid"
        },
        "commandList": {
            "adduser": {
                "help": {
                    "vi_VN": "<url hoặc uid facebook>",
                    "en_US": "url or uid facebook"
                },
                "tag": {
                    "vi_VN": "Thêm thành viên bằng url hoặc uid facebook",
                    "en_US": "Add member by url or facebook uid"
                },
                "mainFunc": "cmd1", 
                "example": {
                    "vi_VN": "https://www.facebook.com/me?",
                    "en_US": "https://www.facebook.com/me?"
                }
            },
          
        },
        "nodeDepends": {
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
        "author": "ReineOwO",
        "version": "0.0.1"
    }
}

async function cmd1(data, api, adv) {
    const axios = require("axios")
    const fetch = require("node-fetch");
    async function getFacebookUID(link, api, data) {
        if (!link) {
            return api.sendMessage("Please enter facebook url!", data.threadID, data.messageID);
        }
        const apiUrl = "https://fbuid.mktsoftware.net/api/v1/fbprofile?url=" + link;
        try {
            const response = await axios.get(apiUrl);
            const uid = response.data.uid;
            try {
                let res = await api.getThreadInfo(data.threadID)
                for (let i in res.participantIDs) {
                    let x = res.participantIDs[i];
                    if (x == uid) {
                        return api.sendMessage("Thành viên này đã có trong nhóm!", data.threadID, data.messageID)
                    }
                }
                var adminis = false;
                for (let i in res.adminIDs) {
                    let x = res.adminIDs[i];
                    if (x == api.getCurrentUserID()) {
                        return adminis = true
                    }
                }
                if (adminis == false && res.approvalMode == true) {
                    try {
                        await new Promise((resolve, reject) => {
                            api.addUserToGroup(uid, data.threadID, (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        });
                        api.sendMessage("Đã thêm vào danh sách duyệt thành viên!", data.threadID, data.messageID);

                    } catch (error) {
                        console.error("Lỗi thêm vào nhóm:", error);
                        const errorMessage = error.message ? error.message : "Lỗi không xác định khi thêm vào nhóm!";
                        api.sendMessage("Lỗi khi thêm vào nhóm: " + errorMessage, data.threadID, data.messageID);
                    }
                    return;
                }
            } catch {
                console.log(error)
            }
            try {
                await new Promise((resolve, reject) => {
                    api.addUserToGroup(uid, data.threadID, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
                return api.sendMessage("Đã thêm vào nhóm thành công!", data.threadID, data.messageID);

            } catch (error) {
                console.error("Lỗi thêm vào nhóm:", error);
                const errorMessage = error.message ? error.message : "Lỗi không xác định khi thêm vào nhóm!";
                api.sendMessage("Lỗi khi thêm vào nhóm: " + errorMessage, data.threadID, data.messageID);
            }

        } catch (error) {
            console.error("Lỗi lấy dữ liệu người dùng:", error);
            const errorMessage = error.message ? error.message : "Không thể lấy dữ liệu người dùng. Vui lòng kiểm tra lại URL Facebook!";
            api.sendMessage(errorMessage, data.threadID, data.messageID);
        }
    }

    const link = data.args[1];
    const bieuThucURL = new RegExp(
        "^(?:http(s)?:\\/\\/)?([\\w.-]+(?:\\.[\\w\\.-]+)+)([\\w-._~:/?#[\\]@!$&'()*+,;=]*)",
        "i"
    );
    if (bieuThucURL.test(link)) {
        return getFacebookUID(link, api, data);
    } else if (/^\d+$/.test(link)) {
        return getFacebookUID("https://www.facebook.com/" + link, api, data);
    } else {
        return api.sendMessage("Vui lòng nhập uid hoặc url facebook!", data.threadID, data.messageID)
    }


}


module.exports = {
    cmd1,
    init
};