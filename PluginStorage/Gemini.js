function init() {
    return {
        "pluginName": "Gemini",
        "pluginMain": "Gemini.js",
        "desc": {
            "vi_VN": "Briefly describe the plugin's function in Vietnamese",
            "en_US": "Briefly describe the plugin's function in English"
        },
        "commandList": {
            "gemini": {
                "help": {
                    "vi_VN": "How to use command 1 in Vietnamese",
                    "en_US": "How to use command 1 in English"
                },
                "tag": {
                    "vi_VN": "Command description in Vietnamese",
                    "en_US": "Command description in English"
                },
                "mainFunc": "cmd1", //function name of command 1
                "example": {
                    "vi_VN": "Vietnamese example",
                    "en_US": "English example"
                }
            },
            "geminiAI": {
                "help": {
                    "vi_VN": "How to use command 2 in Vietnamese",
                    "en_US": "How to use command 2 in English"
                },
                "tag": {
                    "vi_VN": "Command description in Vietnamese",
                    "en_US": "Command description in English"
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
            "geminiStatus": false
        },
        "chathook": "chathook", //function will always be called when receiving message even without prefix
        // "onload": "onload", //function will be run during plugin load
        // "loginFunc": "login", //Function will be called on successful Facebook loginFunc
        "obb": "The required directory name for the plugin is in /plugins/obb",
        "author": "Y2TB Team",
        "version": "0.0.1"
    }
}




async function status(data, api, adv) {
    let {
        rlang,
        config,
        getThreadInfo
    } = adv;

    // if (global.config.facebook.admin.indexOf(data.senderID) == -1) return api.sendMessage(rlang("noPermision"), data.threadID, data.messageID);

    if (global.config.facebook.admin.indexOf(data.senderID) == -1) {
        let adminL = (await getThreadInfo(data.threadID)).adminIDs;
        let check = false;
        for (let i of adminL) if (i.id == data.senderID) {
            check = true; break;
        }
        if (!check) return api.sendMessage("No permision!", data.threadID, data.messageID);
    }

    if (global.data.geminiStatus[data.threadID] || (data.args[1] && data.args[1].toLowerCase() == "off")) {
        global.data.geminiStatus[data.threadID] = false; api.sendMessage("Turn off Gemini!", data.threadID, data.messageID)
    } else {
        global.data.geminiStatus[data.threadID] = true; api.sendMessage("Turn on Gemini!", data.threadID, data.messageID)

        // startChat();
    }
}



async function startChat() {
    const {
        GoogleGenerativeAI,
        HarmCategory,
        HarmBlockThreshold,
    } = require("@google/generative-ai");

    const apiKey = "APIKEY";
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: "Bạn là một công chúa tên Elysia. Bạn xưng là ta và gọi người khác là chàng. Bạn sử dụng ngôn ngữ đầy chất thơ và giàu cảm xúc. Bạn giúp người khác giải quyết tất cả mọi vấn đề. Bạn có hiểu biết sâu rộng về tất cả lĩnh vực. \n",
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };


    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });
}


async function cmd1(data, api, adv) {
    if (data.body == "") return api.sendMessage("Vui lòng nhập nội dung muốn hỏi Gemini!", data.threadID, data.messageID);

    const {
        GoogleGenerativeAI,
        HarmCategory,
        HarmBlockThreshold,
    } = require("@google/generative-ai");

    const apiKey = "AIzaSyBmQmF0xrmaax-4Scak5C6t9KUOMvh8w9s";
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: "Bạn là một công chúa tên Elysia. Bạn xưng là ta và gọi người khác là chàng. Bạn sử dụng ngôn ngữ đầy chất thơ và giàu cảm xúc. Bạn giúp người khác giải quyết tất cả mọi vấn đề. Bạn có hiểu biết sâu rộng về tất cả lĩnh vực. \n",
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };


    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });
    const abc = data.body
    const result = await chatSession.sendMessage(abc);
    //   console.log(result.response.text());
    api.sendMessage(result.response.text(), data.threadID, data.messageID)
}



function cmd2(data, api, adv) {
    //code
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


    const {
        GoogleGenerativeAI,
        HarmCategory,
        HarmBlockThreshold,
    } = require("@google/generative-ai");

    const apiKey = "AIzaSyBmQmF0xrmaax-4Scak5C6t9KUOMvh8w9s";
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: "Bạn là một công chúa tên Elysia. Bạn xưng là ta và gọi người khác là chàng. Bạn sử dụng ngôn ngữ đầy chất thơ và giàu cảm xúc. Bạn giúp người khác giải quyết tất cả mọi vấn đề. Bạn có hiểu biết sâu rộng về tất cả lĩnh vực. \n",
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };


    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    var messageS = data.args;
    const result = await chatSession.sendMessage(messageS);
    //   console.log(result.response.text());
    api.sendMessage(result.response.text(), data.threadID, data.messageID)







}
function onload(info) {
    //The variable info will store all the data returned from the init function
}
function login(api, adv) {
    //code
}

module.exports = {
    cmd1,
    status,
    // cmd2,
    chathook,
    // onload,
    // login,
    init
};
