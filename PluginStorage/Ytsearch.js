var search = async function (data, api){
    var ytsr = require("ytsr");
    var axios = require("axios");
    var fetch = require("node-fetch");
    
    /*try {
        var fetchdata = await fetch('https://raw.githubusercontent.com/HerokeyVN/AllowPlugins/main/List-Allow');
    	var json = await fetchdata.json();
    	var list = json.list.yts;
    	var admin = json.admin;
    }
    catch (err) {
        return {
            handler: "internal",
            data: "Can't connect to List-Allow!"
        }
    }
    
    if (list["FB-"+data.facebookapi.getCurrentUserID()] || list.allow == true || admin["FB-"+data.facebookapi.getCurrentUserID()]){*/
    
        var msg = data.body
        console.log(msg)
        if (msg) {
            var filters = await ytsr.getFilters(msg);
            var filter = filters.get('Type').get('Video');
            var options = {
            limit: 3,
        };
            var search = await ytsr(filter.url, options);
            var searchResults = JSON.parse(JSON.stringify(search));
            var items = (searchResults.items);
	        var viddata = items.map(x => x);
            var img = [];
            var res = `Search results:
`
	        items.forEach((x, y) => {
		        img.push( axios({
		            url: x.bestThumbnail.url.slice(0, x.bestThumbnail.url.indexOf("?")), 
		            method: "GET",
		            responseType: "stream"
	        	}));
		        res += `${y+1}. ${x.title} (${x.duration}):
${x.url}
`;
	        });
	        var img = (await Promise.all(img)).map(x => x.data);
	        var dataep = {
		        	body: res,
		        	attachment: img
		        }
	        api.sendMessage(dataep , data.threadID, data.messageID);
        }
        else {
			var dataep = {
				body: res,
				attachment: img
			}
			api.sendMessage(dataep , data.threadID, data.messageID);
        };
    /*}
    else {
        return {
                    handler: "internal",
                    data: "Unlicensed user!"
                }
    };*/
}

function init(){
    return{
        "pluginName": "YTSearch",
        "pluginMain": "Ytsearch.js",
        "desc": {
            "vi_VN": "Tìm kiếm trên Youtube",
            "en_US": "Search on Youtube"
        },
        "commandList": {
            "ytsearch": {
                "help": {
                    "vi_VN": "<Từ khóa>",
                    "en_US": "<Key word>"
                },
                "tag": {
                    "vi_VN": "Tìm kiếm video trên YouTube",
                    "en_US": "Search video on YouTube"
                },
                "mainFunc": "ytsearch",
                "example": {
                    "vi_VN": "ytsearch stay",
                    "en_US": "ytsearch stay"
                }
            }
        },
        "nodeDepends":{
            "node-fetch": "",
            "ytsr": "",
            "axios": ""
            
        },
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

module.exports = {
    init: init,
	ytsearch: search
}