function init(){
    return{
        "pluginName": "Math",
        "pluginMain": "Math.js",
        "desc": {
			"vi_VN": "Tính toán những phương trình phức tạp",
			"en_US": "Calculating complex equations"
        },
        "commandList": {
            "math": {
                "help": {
                    "vi_VN": "<Phương trình>",
                    "en_US": "<Equation>"
                },
                "tag": {
                    "vi_VN": "",
                    "en_US": ""
                },
                "mainFunc": "math",
                "example": {
                    "vi_VN": "math x^2+2x-3=0",
                    "en_US": "math x^2+2x-3=0"
                }
            }
        },
        "nodeDepends":{
            "sync-request": "",
            "stream-buffers": ""
        },
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

async function math (data, api) {
    var axios = require("axios");
	var msg = data.body;
	if (msg == "") {
		api.sendMessage("Lỗi: Phương trình không được để trống!", data.threadID, data.messageID);
	} else {
		var dataa = JSON.parse(require('sync-request')("GET", "https://coccoc.com/composer/math?q=" + encodeURIComponent(msg)).body.toString());
  console.log(dataa);
		if (!dataa.math.hasOwnProperty("variants")) {
			api.sendMessage("Lỗi: Không phải phương trình!", data.threadID, data.messageID);
		} else if (!dataa.math.variants.length) {
			api.sendMessage("Lỗi: Phương trình không có lời giải!", data.threadID, data.messageID);
		} else {
			var response = "";
			response += "Phương trình: " + dataa.math.variants[0].texImage.replaced_formula;
			response += "\r\nĐáp án: " + (dataa.math.variants[0].answers[0].replaced_formula != "" ? dataa.math.variants[0].answers[0].replaced_formula : dataa.math.variants[0].answers[0].description);
			if (dataa.math.variants[0].answers[0].replaced_formula != "") {
				api.sendMessage(response, data.threadID, data.messageID);
			} else {
				var rt = {
						body: response,
						attachment: (await axios({
						    url: dataa.math.variants[0].answers[0].answer_url,
                            method: "GET", 
                            responseType: "stream"
                        })).data
					}
				console.log(rt)
				api.sendMessage(rt, data.threadID, data.messageID);
			}
		}
	}
}

module.exports = {
	math,
	init
}