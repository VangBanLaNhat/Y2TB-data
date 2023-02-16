function init(){
    return{
        "pluginName": "T2Speaks",
        "pluginMain": "T2Speaks.js",
        "desc": {
			"vi_VN": "Chuyển văn bản thành giọng nói",
			"en_US": "Convert Text to Speech"
        },
        "commandList": {
            "say": {
                "help": {
                    "vi_VN": "[ISO 639-1 (vi/en/...)] <Văn bản>",
                    "en_US": "[ISO 639-1 (vi/en/...)] <text>"
                },
                "tag": {
                    "vi_VN": "Chuyển văn bản thành giọng nói",
                    "en_US": "Convert Text to Speech"
                },
                "mainFunc": "tts",
                "example": {
                    "vi_VN": "say em đẹp lắm",
                    "en_US": "say Hello"
                }
            }
        },
        "author": "UIRI",
        "version": "0.5.0"
    }
}

var iso639_1 = ["ab","aa","af","ak","sq","am","ar","an","hy","as","av","ae","ay","az","bm","ba","eu","be","bn","bh","bi","bs","br","bg","my","ca","ch","ce","ny","zh","cv","kw","co","cr","hr","cs","da","dv","nl","dz","en","eo","et","ee","fo","fj","fi","fr","ff","gl","ka","de","el","gn","gu","ht","ha","he","hz","hi","ho","hu","ia","id","ie","ga","ig","ik","io","is","it","iu","ja","jv","kl","kn","kr","ks","kk","km","ki","rw","ky","kv","kg","ko","ku","kj","la","lb","lg","li","ln","lo","lt","lu","lv","gv","mk","mg","ms","ml","mt","mi","mr","mh","mn","na","nv","nd","ne","ng","nb","nn","no","ii","nr","oc","oj","cu","om","or","os","pa","pi","fa","pl","ps","pt","qu","rm","rn","ro","ru","sa","sc","sd","se","sm","sg","sr","gd","sn","si","sk","sl","so","st","es","su","sw","ss","sv","ta","te","tg","th","ti","bo","tk","tl","tn","to","tr","ts","tt","tw","ty","ug","uk","ur","uz","ve","vi","vo","wa","cy","wo","fy","xh","yi","yo","za","zu"];

async function tts(data, api) {
    let fetch = require("node-fetch");
    var streamBuffers = require("stream-buffers");
	if (data.body != "") {
		var str = "";
		//Default language is the user language.
		var lang = global.config.bot_info.lang.split("_")[0];
		
	 	if (data.args.length > 2) {
			if (iso639_1.indexOf(data.args[1].toLocaleLowerCase())+1) {
				lang = data.args[1].toLocaleLowerCase();
				str = data.args.slice(2).join(" ");
			} else {
				str = data.args.slice(1).join(" ");
			}
		} else {
			str = data.args[1];
		}
		
		var url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(str)}&tl=${lang.toLocaleLowerCase()}&client=tw-ob`;
		
		let r = await fetch(url, {
			headers: {
				"User-Agent": global.coreconfig.facebook.userAgent
			}
		});
		
		if (r.status == 200) {
		    let buf = await r.buffer();
			let file = new streamBuffers.ReadableStreamBuffer({
			    frequency: 10,
				chunkSize: 2048
			});
			file.path = "tts.mp3";
			file.put(buf);
			file.stop();
			api.sendMessage({attachment: [file]}, data.threadID, data.messageID);
		} else {
			console.log("T2Speaks", `Google rejected query with HTTP status code ${r.status} (${r.statusText}). Please create a bug report at Issues tab on C3C Repository witb this information:`, "\r\n", `Message: ${str}\tLanguage: ${lang}`);
			api.sendMessage(`Error: HTTP ${r.status} ${r.statusText}`, data.threadID, data.messageID);
		}
	} else {
	    api.sendMessage("There's no message to convert to speech.", data.threadID, data.messageID);
	}
}

module.exports = {
	tts,
	init
}