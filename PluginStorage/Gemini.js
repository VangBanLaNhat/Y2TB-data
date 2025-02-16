function init() {
    return {
        "pluginName": "Gemini",
        "pluginMain": "Gemini.js",
        "desc": {
            "vi_VN": "Trò chuyện với Google Gemini nhưng phiên bản đáng yêu hơn!",
            "en_US": "Chat with Google Gemini but cuter version!"
        },
        "commandList": {
            "gemini": {
                "help": {
                    "vi_VN": "<Nội dung>",
                    "en_US": "<Content>"
                },
                "tag": {
                    "vi_VN": "Hỏi Gemini một câu nào đó.",
                    "en_US": "Ask Gemini a question."
                },
                "mainFunc": "cmd1", 
                "example": {
                    "vi_VN": "Xin chào",
                    "en_US": "Hello"
                }
            },
            "geminiAI": {
                "help": {
                    "vi_VN": "[on || off]",
                    "en_US": "[on || off]"
                },
                "tag": {
                    "vi_VN": "Bật || Tắt tính năng rep tất cả tin nhắn!",
                    "en_US": "Turn on || Turn off the ability to reply to all messages!"
                },
                "mainFunc": "status", //function name of command 2
                "example": {
                    "vi_VN": "Vietnamese example",
                    "en_US": "English example"
                }
            },
        },
        "nodeDepends": {
            //List of required node_modules of the plugin
            "@google/generative-ai": ""
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
            "APIKey": "YOUR_KEY",
            "Intruction" : "YOUR_INSTRUCTION"
        },
        "chathook": "chathook",
        "onload": "onload", 
        "author": "Y2TB Team",
        "version": "0.0.1"
    }
}



const {
    GoogleGenerativeAI
} = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const cacheDir = path.join(__dirname, "/cache/gemini");
const apiKeyFile = path.join(cacheDir, "gemini.json");
const statusFile = path.join(cacheDir, "status.json");
const defaultApiKeys = [
    "YOUR_KEY"
];

fs.mkdirSync(cacheDir, {
    recursive: true
});

let apiKeys = loadApiKeys();
let currentApiKeyIndex = 0;
let genAI = new GoogleGenerativeAI(getApiKey());
let model = createModel();
let chatSessions = new Map();

function loadApiKeys() {
    try {
        const data = fs.readFileSync(apiKeyFile, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.warn("Không tìm thấy file API Key, sử dụng API Key mặc định.");
        const initialData = {
            apiKeys: defaultApiKeys,
            requestCounts: defaultApiKeys.map(() => 0),
            currentApiKeyIndex: 0,
        };
        fs.writeFileSync(apiKeyFile, JSON.stringify(initialData, null, 2), "utf8");
        return initialData;
    }
}

function saveApiKeys() {
    fs.writeFileSync(apiKeyFile, JSON.stringify(apiKeys, null, 2), "utf8");
}

function getApiKey() {
    return apiKeys.apiKeys[currentApiKeyIndex];
}

function createModel() {
    return genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: "YOUR_INSTRUCTION",
    });
}

// async function resetChatSessions() {
// 
//     for (let session of chatSessions.values()) {
//         try {
//             if (session && typeof session.close === 'function') {
//                 await session.close();
//             } else {
//                 console.warn("err");
//             }
//         } catch (error) {
//             console.error("err:", error);
//         }
//     }
//     chatSessions.clear();
// }

function updateApiKeyUsage() {
    apiKeys.requestCounts[currentApiKeyIndex]++;

    if (apiKeys.requestCounts[currentApiKeyIndex] >= 1500) {
        console.log("Đã đạt giới hạn 1500 request cho API Key hiện tại. Chuyển sang API Key mới.");
        apiKeys.requestCounts[currentApiKeyIndex] = 0;
        currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.apiKeys.length;
        console.log(`Sử dụng API Key mới: ${apiKeys.apiKeys[currentApiKeyIndex]}`);

        // resetChatSessions(); // Đóng các session cũ

        genAI = new GoogleGenerativeAI(getApiKey());
        model = createModel(); 
    }
    saveApiKeys();
}





function loadStatus() {
  try {
    const data = fs.readFileSync(statusFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.warn("Không tìm thấy file trạng thái, tạo file mới.");
    fs.writeFileSync(statusFile, "{}", "utf8");
    return {};
  }
}

function saveStatus() {
    fs.writeFileSync(statusFile, JSON.stringify(global.data.geminiStatus, null, 2), "utf8");
  }

async function status(data, api, adv) {
    let { rlang, config, getThreadInfo } = adv;

    if (global.config.facebook.admin.indexOf(data.senderID) == -1) {
        let adminL = (await getThreadInfo(data.threadID)).adminIDs;
        let check = false;
        for (let i of adminL) {
            if (i.id == data.senderID) {
                check = true;
                break;
            }
        }
        if (!check) return api.sendMessage("No permision!", data.threadID, data.messageID);
    }

    const threadID = data.threadID;
    let currentStatus = global.data.geminiStatus[threadID] || false;

    if (data.args[1] && data.args[1].toLowerCase() == "off") {
        if (!global.data.geminiStatus[threadID]) {
            return api.sendMessage("Gemini is now off!", threadID, data.messageID);
        }
        global.data.geminiStatus[threadID] = false;
        chatSessions.delete(threadID);
        api.sendMessage("Turn off Gemini!", threadID, data.messageID);
        saveStatus();
    } else {
        if (currentStatus) {
            return api.sendMessage("Gemini is now on!", threadID, data.messageID); 
        } else {
            global.data.geminiStatus[threadID] = true;
            if (!chatSessions.has(threadID)) {
                chatSessions.set(threadID, model.startChat({
                    generationConfig: {
                        temperature: 1,
                        topP: 0.95,
                        topK: 40,
                        maxOutputTokens: 8192,
                        responseMimeType: "text/plain",
                    },
                    history: [],
                }));
            }
            api.sendMessage("Turn on Gemini!", threadID, data.messageID);
            saveStatus();
        }
    }
}

async function cmd1(data, api, adv) {
    if (data.body == "") return api.sendMessage("Vui lòng nhập nội dung muốn hỏi Gemini!", data.threadID, data.messageID);

    const threadID = data.threadID;
    let chatSession = chatSessions.get(threadID);

    if (!chatSession) {
        chatSession = model.startChat({
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
                responseMimeType: "text/plain",
            },
            history: [],
        });
        chatSessions.set(threadID, chatSession);
    }

    try {
        const result = await chatSession.sendMessage(data.body);
        api.sendMessage(result.response.text(), data.threadID, data.messageID);
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API:", error);
        api.sendMessage("Có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.", data.threadID, data.messageID);
    } finally {
        updateApiKeyUsage();
    }
}

async function chathook(data, api, adv) {
    if (data.type != "message") return;

    let {
        rlang,
        config,
        replaceMap
    } = adv;

    !global.data.geminiStatus ? global.data.geminiStatus = {} : '';
    global.data.geminiStatus[data.threadID] == undefined ? global.data.geminiStatus[data.threadID] = config.geminiStatus : '';

    if (!global.data.geminiStatus[data.threadID]) return;
    if (data.body.indexOf(global.config.facebook.prefix) == 0) return;

    const threadID = data.threadID;
    const chatSession = chatSessions.get(threadID);

    if (!chatSession) {
        return;
    }

    const messageS = data.body;
    try {
        const result = await chatSession.sendMessage(messageS);
        api.sendMessage(result.response.text(), data.threadID, data.messageID);
    } catch (error) {
        console.error("Lỗi khi gọi Gemini API:", error);
        api.sendMessage("Có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.", data.threadID, data.messageID);
    } finally {
        updateApiKeyUsage();
    }
}
function onload(info) {
    global.data.geminiStatus = loadStatus(); 


  for (const threadID in global.data.geminiStatus) {
    if (global.data.geminiStatus[threadID]) {
      chatSessions.set(threadID, model.startChat({
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        },
        history: [],
      }));
    }
  }

}


module.exports = {
    cmd1,
    status,
    chathook,
    onload,
    init
};