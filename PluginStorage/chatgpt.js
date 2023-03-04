function init() {
	return {
		"pluginName": "ChatGPT",
		"pluginMain": "chatgpt.js",
		"desc": {
			"vi_VN": "Chat với ChatGPT",
			"en_US": "Chat with ChatGPT"
		},
		"commandList": {
			"gpt": {
				"help": {
					"vi_VN": "<msg>",
					"en_US": "<msg>"
				},
				"tag": {
					"vi_VN": "Chat với ChatGPT",
					"en_US": "Chat with ChatGPT"
				},
				"mainFunc": "main",
				"example": {
					"vi_VN": "gpt hi",
					"en_US": "gpt hi"
				}
			},
			"gptdel": {
				"help": {
					"vi_VN": "",
					"en_US": ""
				},
				"tag": {
					"vi_VN": "Xoá dữ liệu trò chuyện với ChatGPT tại Thread này",
					"en_US": "Delete chat data with ChatGPT at this Thread"
				},
				"mainFunc": "del",
				"example": {
					"vi_VN": "gptdel",
					"en_US": "gptdel"
				}
			}
		},
		"nodeDepends": {
			"openai": ""
		},
		"author": "HerokeyVN",
		"version": "0.0.1"
	}
}

async function main(data, api) {
	if(data.body = "") return api.sendMessage("Please enter the input!", data.threadID, data.messageID);
	!global.data.openai ? global.data.openai = {}:"";
	!global.data.openai.chatgpt ? global.data.openai.chatgpt = {}:"";
	!global.data.openai.chatgpt[data.threadID] ? global.data.openai.chatgpt[data.threadID] = []:"";
	const { Configuration, OpenAIApi } = require("openai");
	const configuration = new Configuration({
		apiKey: "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",
	});
	const openai = new OpenAIApi(configuration);
	
	try{
		global.data.openai.chatgpt[data.threadID].push({
			"role": "user",
			"content": data.body
		});
		let api_res = await openai.createCompletion({
			model: "gpt-3.5-turbo",
			message: global.data.openai.chatgpt[data.threadID],
		})
		
		global.data.openai.chatgpt[data.threadID].push(api_res.data.choices[0].message);
		//console.log(api_res.data.choices[0].text);
		api.sendMessage(api_res.data.choices[0].message.content.toString(), data.threadID, data.messageID);
	} catch(e){
		console.error("ChatGPT", e);
		api.sendMessage(e, data.threadID, data.messageID);
	}
}

function del(data, api){
	!global.data.openai ? global.data.openai = {}:"";
	!global.data.openai.chatgpt ? global.data.openai.chatgpt = {}:"";
	global.data.openai.chatgpt[data.threadID] = [];
	api.sendMessage("Deleted chat data with ChatGPT in this Thread", data.threadID, data.messageID);
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
	del,
	main,
	init
};
