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
			"gptv1": {
				"help": {
					"vi_VN": "<msg>",
					"en_US": "<msg>"
				},
				"tag": {
					"vi_VN": "Chat với ChatGPT",
					"en_US": "Chat with ChatGPT"
				},
				"mainFunc": "mainv1",
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
  "config": {
    "apiKey": "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"
  },
		"author": "HerokeyVN",
		"version": "0.0.1"
	}
}

async function mainv1(data, api, adv) {
	console.log(adv.config.apiKey);
	if(data.body == "") return api.sendMessage("Please enter the input!", data.threadID, data.messageID);
	!global.data.openai ? global.data.openai = {}:"";
	!global.data.openai.chatgpt ? global.data.openai.chatgpt = {}:"";
	!global.data.openai.chatgpt[data.threadID] ? global.data.openai.chatgpt[data.threadID] = []:"";
	const { Configuration, OpenAIApi } = require("openai");
	const configuration = new Configuration({
		apiKey: adv.config.apiKey,
	});
	const openai = new OpenAIApi(configuration);
	
	try{
		/*global.data.openai.chatgpt[data.threadID].push({
			"role": "user",
			"content": data.body
		});*/
		console.log(data.body);
		let api_res = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: data.body,
			temperature: 0.7
			//max_tokens: 2049
		})
		
		//global.data.openai.chatgpt[data.threadID].push(api_res.data.choices[0].message);
		//console.log(api_res.data.choices[0].text);
		api.sendMessage(api_res.data.choices[0].text.toString(), data.threadID, data.messageID);
	} catch(e){
		console.error("ChatGPT", e.response);
		
		return api.sendMessage(e.response.data.error.message, data.threadID, data.messageID);
	}
}

async function main(data, api, adv, ii) {
	if(data.body == "") return api.sendMessage("Please enter the input!", data.threadID, data.messageID);
	!global.data.openai ? global.data.openai = {}:"";
	!global.data.openai.chatgpt ? global.data.openai.chatgpt = {}:"";
	!global.data.openai.chatgpt[data.threadID] ? global.data.openai.chatgpt[data.threadID] = []:"";
	
	!global.openai ? global.openai = {}:"";
	!global.openai.timeout ? global.openai.timeout = {}:"";
	!global.openai.timeout.chatgpt ? global.openai.timeout.chatgpt = {}:"";
	
	const { Configuration, OpenAIApi } = require("openai");
	const configuration = new Configuration({
		apiKey: adv.config.apiKey,
	});
	const openai = new OpenAIApi(configuration);
	
	if(!global.openai.timeout.chatgpt[data.threadID])
		global.openai.timeout.chatgpt[data.threadID] = setTimeout(function() {
				global.data.openai.chatgpt[data.threadID] = [];
				api.sendMessage("Deleted chat data with ChatGPT in this Thread", data.threadID, data.messageID);
		}, 1*30*60*1000);
	
	try{
		global.data.openai.chatgpt[data.threadID].push({
			"role": "user",
			"content": data.body
		});
		//console.log(data.body);
		let api_res = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: global.data.openai.chatgpt[data.threadID],
			max_tokens: 2049 - data.body.length
		})
		
		if(api_res.data.choices[0].message.content.toString().length <= 1000){
			global.data.openai.chatgpt[data.threadID].push(api_res.data.choices[0].message);
		}
		//console.log(api_res.data.choices[0].text);
		api.sendMessage(api_res.data.choices[0].message.content.toString(), data.threadID, data.messageID);
	} catch(e){
		if(e.response.status == 429 || e.response.status == 401 ||e.response.status == 404){
			console.error("ChatGPT", e.response);
		
			return api.sendMessage(e.response.data.error.message, data.threadID, data.messageID);
		}
		
		ii = !ii?0:ii;
		if(ii > 20) {
			console.error("ChatGPT", e);
			return api.sendMessage(e, data.threadID, data.messageID);
		}
		global.data.openai.chatgpt[data.threadID].shift();
		global.data.openai.chatgpt[data.threadID].shift();
		return main(data, api, adv, ii+1);
	}
}


function del(data, api){
	!global.data.openai ? global.data.openai = {}:"";
	!global.data.openai.chatgpt ? global.data.openai.chatgpt = {}:"";
	global.data.openai.chatgpt[data.threadID] = [];
	try{
		clearTimeout(global.openai.timeout.chatgpt[data.threadID]);
	} catch(_){};
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
	mainv1,
	init
};