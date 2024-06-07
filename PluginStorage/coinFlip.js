function init() {
    return {
        "pluginName": "Coin Flip",
        "pluginMain": "coinFlip.js",
        "desc": {
            "vi_VN": "Tung đồng xu",
            "en_US": "Toss a coin"
        },
        "commandList": {
            "coinflip": {
                "help": {
                    "vi_VN": "< s | n > [Tiền cược]  (s: sấp, n: ngửa)",
                    "en_US": "< t | h > [Bet]  (t: tails, h: heads)"
                },
                "tag": {
                    "vi_VN": "Tung đồng xu",
                    "en_US": "Toss a coin"
                },
                "mainFunc": "main",
                "example": {
                    "vi_VN": "coinflip s 500",
                    "en_US": "coinflip t 500"
                }
            }
        },
        "langMap": {
            "tossing": {
                "desc": "The coin is being tossed",
                "vi_VN": "Đang tung đồng xu 🪙...",
                "en_US": "Tossing a coin 🪙...",
                "args": {}
            },
            "res": {
                "desc": "Returns results",
                "vi_VN": "Bạn đã {isWin}, đồng xu cho ra mặt {res}. Số tiền hiện có: {money}",
                "en_US": "You {isWin}, the coin came up {res}. Current amount: {money}",
                "args": {
                	"{isWin}": {
                		"vi_VN": "Thắng hoặc thua",
                		"en_US": "Win or lose"
                	},
                	"{res}": {
                		"vi_VN": "Sấp hoặc ngửa",
                		"en_US": "Heads or tails"
                	},
                	"{money}": {
                		"vi_VN": "Số tiền hiện có",
                		"en_US": "Current amount"
                	}
                }
            },
            "wrong": {
                "desc": "Wrong syntax",
                "vi_VN": "Sai cú pháp! Dùng “{prefix}help coinflip” để xem chi tiết về lệnh.",
                "en_US": "Wrong syntax! Use “{prefix}help coinflip” to view details about the command.",
                "args": {
                	"{prefix}": {
                		"vi_VN": "Prefix",
                		"en_US": "Prefix"
                	}
                }
            },
            "nem": {
                "desc": "The bet is higher than the available amount",
                "vi_VN": "Không thể đặt cược! Tiền cược lớn hơn số tiền hiện có! Hiện có: {money}",
                "en_US": "Cannot bet! The bet is larger than the available amount! Now available: {money}",
                "args": {
                	"{money}": {
                		"vi_VN": "Số tiền hiện có",
                		"en_US": "Current amount"
                	}
                }
            },
            "order": {
                "desc": "Other words",
                "vi_VN": "thắng|thua|sấp|ngửa",
                "en_US": "win|lose|tails|heads",
                "args": {}
            }
        },
        "author": "HerokeyVN",
        "version": "0.0.1"
    }
}

function main(data, api, {rlang, replaceMap}) {
	if (!global.data.economy) return api.sendMessage("The Economy plugin has never been installed. Please ask your BotChat admin to install the Economy plugin to use this command!", data.threadID, data.messageID);
	
	let type = data.args[1];
	let bet = Number(data.args[2]);
	
	switch (type) {
	    case 's':
	    case 't':
	        type = 0;
	        break;
	    case 'n':
	    case 'h':
	        type = 1;
	        break;
	    default:
            return api.sendMessage(replaceMap(rlang("wrong"), {
                "{prefix}": global.config.facebook.prefix
            }), data.threadID, data.messageID)
	}
    !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {coin: 0}:"";
    if (bet && bet < 0) bet = 0;
    if (bet && bet > global.data.economy[data.senderID].coin) return api.sendMessage(replaceMap(rlang("nem"), {
        "{money}": global.data.economy[data.senderID].coin+global.data.economyConfig.icon
    }), data.threadID, data.messageID);
    if (!bet) bet = 0;
    
    let res = randomInt(0, 1);
    if (res == type) global.data.economy[data.senderID].coin += bet;
    else global.data.economy[data.senderID].coin -= bet;
    
    let arr = rlang("order").split('|');
    
    let map = {
        "{isWin}": (res == type ? arr[0]:arr[1]) + (bet > 0 ? " "+bet+global.data.economyConfig.icon:""),
        "{res}": arr[2+res],
        "{money}": global.data.economy[data.senderID].coin+global.data.economyConfig.icon
    }
    
    api.sendMessage(rlang("tossing"), data.threadID, (e, a)=>setTimeout(()=>{
            if(api.editMessage) api.editMessage(replaceMap(rlang("res"), map), a.messageID);
            else api.sendMessage(replaceMap(rlang("res"), map), data.threadID, data.messageID);
        }, 2*1000)
    , data.messageID)
}

// Functions support

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Module exports

module.exports = {
    init,
    main
};