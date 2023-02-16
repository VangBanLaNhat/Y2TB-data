function init(){
    return{
        "pluginName": "SearchWiki",
        "pluginMain": "Wiki.js",
        "desc": {
            "vi_VN": "Tìm kiếm trên Wiki",
            "en_US": "Search on Wiki"
        },
        "commandList": {
            "wiki": {
                "help": {
                    "vi_VN": "<Từ khóa>",
                    "en_US": "<Key word>"
                },
                "tag": {
                    "vi_VN": "Tìm tất cả mọi thứ trên Wikipedia",
                    "en_US": "Find everything on Wikipedia"
                },
                "mainFunc": "wiki",
                "example": {
                    "vi_VN": "wiki AI",
                    "en_US": "wiki AI"
                }
            }
        },
        "nodeDepends":{
		    "wait-for-stuff": "",
		    "stream-buffers": ""
        },
        "author": "Stowe + BadAimWeeb (f.edit)",
        "version": "0.1.2"
    }
}

function wiki(data, api) {
    if (data.body != "" ){
        var rt = "Searching..."
	    api.sendMessage(rt, data.threadID, data.messageID);
    }
	(async function () {
    var fetch = require("node-fetch");
    var path = require("path");
    var streamBuffers = require("stream-buffers")
		var sT = data.body;
		var sS = encodeURIComponent(sT)
		if (sT === '') {
			return "`"+global.config.facebook.prefix+ "wiki <keyword>`\r\n[Seach on Wikipedia]"
		} else {
			try {
				var api = `https://${global.config.bot_info.lang.split("_")[0]}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${sS}`
				var img = `https://${global.config.bot_info.lang.split("_")[0]}.wikipedia.org/w/api.php?action=query&titles=${sS}&prop=pageimages&format=json&pithumbsize=720`
				console.log("Wiki", "Keyword: "+sT);
				var fetchdata = await fetch(api);
				var fetchimg = await fetch(img);
				var js = await fetchimg.text();
				var json = await fetchdata.text();
				var dbtm = `${js}`;
				var dbt = `${json}`;
				var suggestionData = JSON.parse(dbt);
				var pageid = Object.keys(suggestionData.query.pages)[0];
				var tI = suggestionData.query.pages[pageid].title;
				var eX = suggestionData.query.pages[pageid].extract;
				var title = tI.toString('utf-8');
				var text = eX.toString('utf-8');
				var imgD = JSON.parse(dbtm);
				var pgid = Object.keys(imgD.query.pages)[0];
				if (imgD.query.pages[pgid].thumbnail == undefined) {
				    return `Result: ${title}\n\n- ${text}`
				    api.sendMessage(rt, data.threadID, data.messageID);
				} else {
					var imgX = imgD.query.pages[pgid].thumbnail.source;
					var fetchimgD = await fetch(imgX);
					var buffer = await fetchimgD.buffer();
						var imagesx = new streamBuffers.ReadableStreamBuffer({
							frequency: 10,
							chunkSize: 1024
						});
						imagesx.path = 'image.png';
						imagesx.put(buffer);
						imagesx.stop();
						return {
								body: `Result: ${title}\n\n- ${text}`,
								attachment: ([imagesx])
							}
						api.sendMessage(rt, data.threadID, data.messageID);
				}
			} catch(er) {
				console.log(er)
				return "Data not found!"
				api.sendMessage(rt, data.threadID, data.messageID);
			}
		}
	})().then(function (returndata) {
		api.sendMessage(returndata, data.threadID, data.messageID);
	});
}
module.exports = {
	wiki,
	init
}