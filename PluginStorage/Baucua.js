function init() {
    return {
        "pluginName": "Bầu Cua",
        "pluginMain": "Baucua.js",
        "desc": {
            "vi_VN": "Trò chơi Bầu Cua",
            "en_US": "Chuck-a-luck Game"
        },
        "commandList": {
            "baucua": {
                "help": {
                    "vi_VN": "",
                    "en_US": ""
                },
                "tag": {
                    "vi_VN": "Tạo phòng Bầu Cua",
                    "en_US": "Create a Chuck-a-luck room"
                },
                "mainFunc": "main",
                "example": {
                    "vi_VN": "baucua",
                    "en_US": "baucua"
                }
            }
        },
        "chathook": "chathook",
        "onload": "onload",
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

function onload() {
    !global.temp ? global.temp = {}:"";
    !global.temp.baucua ? global.temp.baucua = {}:"";
    !global.temp.baucua.restart ? global.temp.baucua.restart = false:"";
    if (!global.data.autorestart || global.data.autorestart == 0) return;
    
    setTimeout(()=>{
        global.temp.baucua.restart = true;
        setTimeout(()=>{
            global.temp.baucua.restart = false;
        }, 60*1000)
    }, global.data.autorestart*60*1000-60*1000);
}

async function main(data, api, adv) {
    if (!global.data.economy) return api.sendMessage("The Economy plugin has never been installed. Please ask your BotChat admin to install the Economy plugin to use this command!", data.threadID, data.messageID);
    if (global.temp.baucua.restart) return api.sendMessage("Hệ thống sẽ khởi động lại sau ít hơn 1 phút nữa. Để tránh gián đoạn trò chơi, vui lòng thử lại sau 1 phút", data.threadID, data.messageID);
    if (global.temp.baucua[data.threadID]) return api.sendMessage("Trò chơi đang diễn ra!", data.threadID, data.messageID);
    !global.temp.baucua[data.threadID] ? global.temp.baucua[data.threadID] = {
        player: {}
    }:"";
    //bầu-cua-cá-gà-tôm-nai
    global.temp.baucua[data.threadID].dice = [
        randomInt(1, 6),
        randomInt(1, 6),
        randomInt(1, 6)
    ];
    api.sendMessage("Đã tạo phòng chơi và xóc đĩa. Thời gian đặt cược của bạn là 60 giây, mời bạn đặt cược:\n1. Bầu (🍐)\n2. Cua (🦀)\n3. Cá (🐟)\n4. Gà (🐔)\n5. Tôm (🦐)\n6. Nai (🦌)\n\nVui lòng reply tin nhắn này cùng với số thứ tự của ô bạn muốn đặt (1-6) và số tiền bạn muốn đặt vào ô đó.\n- Ví dụ: 1 1000\n- Giải thích: Bạn đặt ô Bầu với số tiền là 1000"+global.data.economyConfig.icon, data.threadID, (e, a)=>{
        global.temp.baucua[data.threadID].messageID = a.messageID;
    }, data.messageID);
    
    setTimeout(async ()=>{
        api.unsendMessage(global.temp.baucua[data.threadID].messageID);
        let listWinStr = "";
        let num = 1;
        let dice = global.temp.baucua[data.threadID].dice;
        for (let i in global.temp.baucua[data.threadID].player) {
            let obj = global.temp.baucua[data.threadID].player[i];
            let listID = Object.keys(obj);
            let winBet = 0;
            
            for (let id in obj){
                let totalWin = 0;
                for (let j of dice)
                    if (id == j) totalWin++;
                if (totalWin > 0)
                    winBet += obj[id]*(totalWin+1);
            }
            if (winBet == 0) continue;
            
            global.data.economy[data.senderID].coin += winBet;
            
            let name = (await adv.getUserInfo(i)).name;
            listWinStr += `${num++}. ${name}: +${winBet+global.data.economyConfig.icon}. Hiện có: ${global.data.economy[data.senderID].coin+global.data.economyConfig.icon}\n`
        }
        
        let list = ["🍐", "🦀", "🐟", "🐔", "🦐", "🦌"];
        api.sendMessage(`Kết quả:\n|${list[dice[0]-1]}|${list[dice[1]-1]}|${list[dice[2]-1]}|\n\nDanh sách người chơi thắng cuộc: \n${listWinStr}`, data.threadID);
        delete global.temp.baucua[data.threadID];
    }, 60*1000);
}

async function chathook(data, api, adv) {
    if (!global.data.economy) return;
    
    if (data.type != "message_reply" || !global.temp.baucua[data.threadID] || data.body.indexOf(global.config.facebook.prefix) == 0) return;

    if (data.messageReply.messageID != global.temp.baucua[data.threadID].messageID) return;
    // Place a bet
    let msg = data.body.split(" ");
    let id = Math.trunc(Number(msg[0]));
    let bet = Math.trunc(Number(msg[1]));
    
    if (!id || !bet || bet == 0 || id<1 || id>6) return api.sendMessage("Đặt cược không hợp lệ, vui lòng xem lại hướng dẫn khi tạo phòng chơi!", data.threadID, data.messageID);
    !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {coin: 0}:"";
    if (bet > global.data.economy[data.senderID].coin) return api.sendMessage("Số tiền đặt cược lớn hơn số tiền hiện có. Hiện có: "+global.data.economy[data.senderID].coin+global.data.economyConfig.icon, data.threadID, data.messageID);
    
    !global.temp.baucua[data.threadID].player[data.senderID] ? global.temp.baucua[data.threadID].player[data.senderID] = {}:"";
    !global.temp.baucua[data.threadID].player[data.senderID][id] ? global.temp.baucua[data.threadID].player[data.senderID][id] = 0:"";
    
    if (bet + global.temp.baucua[data.threadID].player[data.senderID][id] < 0) bet = global.temp.baucua[data.threadID].player[data.senderID][id]*-1;
    global.temp.baucua[data.threadID].player[data.senderID][id] += bet;
    
    global.data.economy[data.senderID].coin -= bet;
    
    let list = ["Bầu (🍐)", "Cua (🦀)", "Cá (🐟)", "Gà (🐔)", "Tôm (🦐)", "Nai (🦌)"];
    let listStr = "";
    for (let i in global.temp.baucua[data.threadID].player) {
        let obj = global.temp.baucua[data.threadID].player[i];
        let listID = Object.keys(obj);
        
        let name = (await adv.getUserInfo(i)).name;
        
        listStr += name+": ";
        if (listID.length == 1) {
            let id = listID[0];
            listStr += `${list[id-1]} - ${obj[id]+global.data.economyConfig.icon}\n`;
            continue;
        }
        listStr += "\n";
        for (let j of listID) {
            listStr += ` • ${list[j-1]} - ${obj[j]+global.data.economyConfig.icon}\n`;
        }
    }
    api.sendMessage(`Đã đặt ${global.temp.baucua[data.threadID].player[data.senderID][id]+global.data.economyConfig.icon} vào ô ${list[id-1]}. Số tiền còn lại: ${global.data.economy[data.senderID].coin+global.data.economyConfig.icon}. Danh sách đặt cược: \n${listStr}`, data.threadID, data.messageID);
}

// Functions support

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Module exports

module.exports = {
    init,
    main,
    chathook,
    onload
};