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
                "mainFunc": "status", 
                "example": {
                    "vi_VN": "on",
                    "en_US": "off"
                }
            },
        },
        "nodeDepends": {
            "@google/generative-ai": ""
        },
        "langMap": {
            "noPermission": {
                "desc": "No permission message",
                "vi_VN": "Không đủ quyền!",
                "en_US": "No permission!",
                "args": {}
            },
            "turnOn": {
                "desc": "Turn on Gemini",
                "vi_VN": "Đã bật Gemini!",
                "en_US": "Turn on Gemini!",
                "args": {}
            },
            "turnOff": {
                "desc": "Turn off Gemini",
                "vi_VN": "Đã tắt Gemini!",
                "en_US": "Turn off Gemini!",
                "args": {}
            },
            "isOn": {
                "desc": "Gemini is on",
                "vi_VN": "Gemini đang bật!",
                "en_US": "Gemini is now on!",
                "args": {}
            },
            "isOff": {
                "desc": "Gemini is off",
                "vi_VN": "Gemini đang tắt!",
                "en_US": "Gemini is now off!",
                "args": {}
            },
            "askContent": {
                "desc": "Ask for content",
                "vi_VN": "Vui lòng nhập nội dung muốn hỏi Gemini!",
                "en_US": "Please enter content to ask Gemini!",
                "args": {}
            },
            "errorMessage": {
                "desc": "Error message",
                "vi_VN": "Có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
                "en_US": "An error occurred while processing your request. Please try again later.",
                "args": {}
            }
        },
        "config": {
            "APIKey": "YOUR_KEY",
            "instruction": "Your_instruction",
            "geminiStatus": false
        },
        "chathook": "chathook",
        "onload": "onload",
        "author": "Y2TB Team",
        "version": "0.0.1"
    }
}

// Shared state - initialized during onload
let apiKeys = null;
let currentApiKeyIndex = 0;
let genAI = null;
let model = null;
let chatSessions = new Map();

function loadApiKeys(cacheDir, apiKeyFile) {
    const fs = require("fs");
    const defaultApiKeys = [
        "APIKEY 1",
        "APIKEY 2",
        "APIKEY..."
    ];
    
    try {
        const data = fs.readFileSync(apiKeyFile, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.warn("API key file not found, using default API key.");
        const initialData = {
            apiKeys: defaultApiKeys,
            requestCounts: defaultApiKeys.map(() => 0),
            currentApiKeyIndex: 0,
        };
        fs.writeFileSync(apiKeyFile, JSON.stringify(initialData, null, 2), "utf8");
        return initialData;
    }
}

function saveApiKeys(apiKeyFile) {
    const fs = require("fs");
    fs.writeFileSync(apiKeyFile, JSON.stringify(apiKeys, null, 2), "utf8");
}

function getApiKey() {
    return apiKeys.apiKeys[currentApiKeyIndex];
}

function createModel() {
    return genAI.getGenerativeModel({
        model: "gemini-2.0-flash-lite",
        systemInstruction: "YOUR INSTRUCTION",
    });
}

function updateApiKeyUsage(apiKeyFile) {
    apiKeys.requestCounts[currentApiKeyIndex]++;

    if (apiKeys.requestCounts[currentApiKeyIndex] >= 1500) {
        console.log("Reached 1500 request limit for current API key. Switching to new API key.");
        apiKeys.requestCounts[currentApiKeyIndex] = 0;
        currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.apiKeys.length;
        console.log(`Using new API key: ${apiKeys.apiKeys[currentApiKeyIndex]}`);
        
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        genAI = new GoogleGenerativeAI(getApiKey());
        model = createModel();
    }
    saveApiKeys(apiKeyFile);
}

function loadStatus(statusFile) {
    const fs = require("fs");
    try {
        const data = fs.readFileSync(statusFile, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.warn("Status file not found, creating new file.");
        fs.writeFileSync(statusFile, "{}", "utf8");
        return {};
    }
}

function saveStatus(statusFile) {
    const fs = require("fs");
    fs.writeFileSync(statusFile, JSON.stringify(global.data.geminiStatus, null, 2), "utf8");
}

async function status(data, api, adv) {
    const path = require("path");
    const cacheDir = path.join(__dirname, "/cache/gemini");
    const statusFile = path.join(cacheDir, "status.json");
    
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
        if (!check) return api.sendMessage(rlang("noPermission"), data.threadID, data.messageID);
    }

    const threadID = data.threadID;
    let currentStatus = global.data.geminiStatus[threadID] || false;

    if (data.args[1] && data.args[1].toLowerCase() == "off") {
        if (!global.data.geminiStatus[threadID]) {
            return api.sendMessage(rlang("isOff"), threadID, data.messageID);
        }
        global.data.geminiStatus[threadID] = false;
        chatSessions.delete(threadID);
        api.sendMessage(rlang("turnOff"), threadID, data.messageID);
        saveStatus(statusFile);
    } else {
        if (currentStatus) {
            return api.sendMessage(rlang("isOn"), threadID, data.messageID);
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
            api.sendMessage(rlang("turnOn"), threadID, data.messageID);
            saveStatus(statusFile);
        }
    }
}

async function cmd1(data, api, adv) {
    const path = require("path");
    const cacheDir = path.join(__dirname, "/cache/gemini");
    const apiKeyFile = path.join(cacheDir, "gemini.json");
    
    let { rlang } = adv;
    
    if (data.body == "") return api.sendMessage(rlang("askContent"), data.threadID, data.messageID);

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
        console.error("Error calling Gemini API:", error);
        api.sendMessage(rlang("errorMessage"), data.threadID, data.messageID);
    } finally {
        updateApiKeyUsage(apiKeyFile);
    }
}

function fileToGenerativePart(filepath, mimeType) {
    const fs = require('fs');
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(filepath)).toString("base64"),
            mimeType,
        },
    };
}

async function downloadImage(url, filePath) {
    const fs = require('fs');
    const axios = require('axios');
    const response = await axios({ url, method: 'GET', responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function chathook(data, api, adv) {
    const fs = require('fs');
    const path = require('path');
    const axios = require('axios');
    
    const cacheDir = path.join(__dirname, "/cache/gemini");
    const apiKeyFile = path.join(cacheDir, "gemini.json");
    
    if (data.type !== "message") return;

    let { rlang, config, replaceMap } = adv;

    !global.data.geminiStatus ? global.data.geminiStatus = {} : '';
    global.data.geminiStatus[data.threadID] === undefined ? global.data.geminiStatus[data.threadID] = config.geminiStatus : '';

    if (!global.data.geminiStatus[data.threadID]) return;
    if (data.body.indexOf(global.config.facebook.prefix) === 0) return;

    const threadID = data.threadID;
    const chatSession = chatSessions.get(threadID);

    if (!chatSession) {
        return;
    }
    
    if (data.attachments && data.attachments.length > 0) {
        const attachment = data.attachments[0];
        const link = attachment.url;
        let dir;
        let mimeType;

        if (attachment.type === "photo") {
            dir = path.join(__dirname, "cache", "gemini", "gemini.jpg");
            mimeType = "image/jpg";
        } else if (attachment.type === "video") {
            dir = path.join(__dirname, "cache", "gemini", "gemini.mp4");
            mimeType = "video/mp4";
        } else if (attachment.type === "audio") {
             dir = path.join(__dirname, "cache", "gemini", "gemini.mp3");
             mimeType = "audio/mp3";
        } else {
            return; 
        }
        
        ensureExists(path.join(__dirname, "cache", "gemini"));
        await downloadImage(link, dir);
        const prompt = data.body;
        const attachmentPart = fileToGenerativePart(dir, mimeType);
        
        try {
            const result = await chatSession.sendMessage([prompt, attachmentPart]);
            api.sendMessage(result.response.text(), data.threadID, data.messageID);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            api.sendMessage(rlang("errorMessage"), data.threadID, data.messageID);
        } finally {
            updateApiKeyUsage(apiKeyFile);
        }
        return;
    }

    const messageS = data.body;
    try {
        const result = await chatSession.sendMessage(messageS);
        api.sendMessage(result.response.text(), data.threadID, data.messageID);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        api.sendMessage(rlang("errorMessage"), data.threadID, data.messageID);
    } finally {
        updateApiKeyUsage(apiKeyFile);
    }
}

function onload(info) {
    const fs = require("fs");
    const path = require("path");
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    
    // Setup cache directory
    const cacheDir = path.join(__dirname, "/cache/gemini");
    const apiKeyFile = path.join(cacheDir, "gemini.json");
    const statusFile = path.join(cacheDir, "status.json");
    
    // Create cache directory
    ensureExists(cacheDir);
    
    // Initialize API keys
    apiKeys = loadApiKeys(cacheDir, apiKeyFile);
    currentApiKeyIndex = 0;
    
    // Initialize Gemini
    genAI = new GoogleGenerativeAI(getApiKey());
    model = createModel();
    
    // Load status and create chat sessions
    global.data.geminiStatus = loadStatus(statusFile);

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

function ensureExists(path, mask) {
    const fs = require('fs');
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
    cmd1,
    status,
    chathook,
    onload,
    init
};