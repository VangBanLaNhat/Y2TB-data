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
	const { Configuration, OpenAIApi } = require("openai");
	const configuration = new Configuration({
		apiKey: "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",
	});
	const openai = new OpenAIApi(configuration);
	
	try{
		let api_res = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: text,
			max_tokens: 2049 - text.length
		})
		
		console.log(api_res);
		api.sendMessage(api_res.data.choices[0].text, data.threadID, data.senderID);
	} catch(e){
		console.error("ChatGPT", e);
		api.sendMessage(e, data.threadID, data.senderID);
	}
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
	main,
	init
};
