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
                    "en_US": "<url or uid facebook>"
                },
                "tag": {
                    "vi_VN": "Thêm thành viên bằng url hoặc uid facebook",
                    "en_US": "Add member by url or facebook uid"
                },
                "mainFunc": "cmd1", 
                "example": {
                    "vi_VN": "adduser https://www.facebook.com/me?",
                    "en_US": "adduser https://www.facebook.com/me?"
                }
            },
          
        },
        "langMap": {
            "noLink": {
                "desc": "Error message when user does not enter valid user link",
                "vi_VN": "Vui lòng nhập url Facebook!",
                "en_US": "Please enter facebook url!",
                "args": {}
            },
            "invalidUser": {
                "desc": "Error message when invalid user link",
                "vi_VN": "Link người dùng hoặc UID không hợp lệ!",
                "en_US": "Invalid user link or UID!",
                "args": {}
            },
            "present": {
                "desc": "Notify when there are members in the group",
                "vi_VN": "Thành viên này đã có trong nhóm!",
                "en_US": "This member is already in the group!",
                "args": {}
            },
            "addPending": {
                "desc": "Notify when there are members in the group",
                "vi_VN": "Đã thêm vào danh sách duyệt thành viên!",
                "en_US": "Added to member watchlist!",
                "args": {}
            },
            "cantAdd": {
                "desc": "Notify when cannot add user to this group",
                "vi_VN": "Không thể thêm thành viên vào nhóm!",
                "en_US": "Cannot add user to this group!",
                "args": {}
            },
            "done": {
                "desc": "Notification when successfully added to group",
                "vi_VN": "Đã thêm vào nhóm thành công!",
                "en_US": "Added to group successfully!",
                "args": {}
            }
        },
        "author": "ReineOwO",
        "version": "0.0.1"
    }
}

async function cmd1(data, api, adv) {
    const {rlang, replaceMap} = adv;
    const axios = require("axios");

    async function getFacebookUID(link, api, data) {
        if (!link) {
            return api.sendMessage(rlang("noLink"), data.threadID, data.messageID);
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
                        return api.sendMessage(rlang("present"), data.threadID, data.messageID)
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
                        api.sendMessage(rlang("addPending"), data.threadID, data.messageID);

                    } catch (error) {
                        console.error("adduser", error);
                        const errorMessage = error.message ? error.message : rlang("cantAdd");
                        api.sendMessage(errorMessage, data.threadID, data.messageID);
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
                const errorMessage = error.message ? error.message : rlang("cantAdd");
                api.sendMessage(errorMessage, data.threadID, data.messageID);
            }

        } catch (error) {
            console.error("adduser", error);
            const errorMessage = error.message ? error.message : rlang("invalidUser");
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
        return api.sendMessage(rlang("noLink"), data.threadID, data.messageID);
    }


}


module.exports = {
    cmd1,
    init
};