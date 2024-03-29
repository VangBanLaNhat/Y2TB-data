function init() {
    return {
        "pluginName": "Auto Download",
        "pluginMain": "autodown.js",
        "desc": {
            "vi_VN": "Đã xóa",
            "en_US": "Deleted"
        },
        "author": "Yuuki, HerokeyVN",
        "onload": "onload",
        "version": "0.0.0"
    }
}

module.exports = {
    init,
    onload: ()=>{
        let fs = require("fs");
        let path = require("path");
        let json = JSON.parse(fs.readFileSync(path.join(__dirname, "pluginList.json")));
        delete json["Ytsearch.js"];
        fs.writeFileSync(path.join(__dirname, "pluginList.json"), JSON.stringify(json));
    }
}