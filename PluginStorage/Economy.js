function init() {
  !global.data.economyConfig ? global.data.economyConfig = { icon: "Ꮙ" } : "";
  !global.data.economy ? global.data.economy = {} : "";
  return {
    "pluginName": "Economy",
    "pluginMain": "Economy.js",
    "desc": {
      "vi_VN": "Hệ thống tiền tệ",
      "en_US": "Monetary system"
    },
    "commandList": {
      "work": {
        "help": {
          "vi_VN": "",
          "en_US": ""
        },
        "tag": {
          "vi_VN": "Thăm ngàn",
          "en_US": "Working for money"
        },
        "mainFunc": "work",
        "example": {
          "vi_VN": "work",
          "en_US": "work"
        }
      },
      "slut": {
        "help": {
          "vi_VN": "",
          "en_US": ""
        },
        "tag": {
          "vi_VN": "Làm đ* thôi (Có thể mắc bệnh và mất tiền chữa trị)",
          "en_US": "Slut (May get sick and lose money for treatment)"
        },
        "mainFunc": "slut",
        "example": {
          "vi_VN": "slut",
          "en_US": "slut"
        }
      },
      "crime": {
        "help": {
          "vi_VN": "",
          "en_US": ""
        },
        "tag": {
          "vi_VN": "Đi cướp ngân hàng (Có thể bị cảnh sát bắt và mất tiền hối lộ)",
          "en_US": "Go rob a bank (Can be caught by the police and lose the bail)"
        },
        "mainFunc": "crime",
        "example": {
          "vi_VN": "crime",
          "en_US": "crime"
        }
      },
      "eco": {
        "help": {
          "vi_VN": "<set|add|minus> <giá trị>",
          "en_US": "<set|add|minus> <value>"
        },
        "tag": {
          "vi_VN": "Quản lý hệ thống kinh tế",
          "en_US": "Economic system management"
        },
        "mainFunc": "eco",
        "example": {
          "vi_VN": "eco add 1",
          "en_US": "eco add 1"
        }
      },
      "transfers": {
        "help": {
          "vi_VN": "<Số Tiền> <@Người nhận>",
          "en_US": "<Money> <@Receiver>"
        },
        "tag": {
          "vi_VN": "Chuyển tiền",
          "en_US": "Transfers"
        },
        "mainFunc": "transfers",
        "example": {
          "vi_VN": "transfers 1 @Tien Lam",
          "en_US": "transfers 1 @Tien Lam"
        }
      },
      "bal": {
        "help": {
          "vi_VN": "[@Ai đó]",
          "en_US": "[@Mention]"
        },
        "tag": {
          "vi_VN": "Xem số tiền hiện tại",
          "en_US": "View current amount"
        },
        "mainFunc": "bal",
        "example": {
          "vi_VN": "bal",
          "en_US": "bal"
        }
      },
      "baltop": {
        "help": {
          "vi_VN": "",
          "en_US": ""
        },
        "tag": {
          "vi_VN": "Danh sách người thành đạt",
          "en_US": "List of successful people"
        },
        "mainFunc": "baltop",
        "example": {
          "vi_VN": "baltop",
          "en_US": "baltop"
        }
      },
      "daily": {
        "help": {
          "vi_VN": "",
          "en_US": ""
        },
        "tag": {
          "vi_VN": "Điểm danh hàng ngày",
          "en_US": "Daily attendance"
        },
        "mainFunc": "daily",
        "example": {
          "vi_VN": "daily",
          "en_US": "daily"
        }
      }
    },
    "nodeDepends": {
      "random": "3.0.6"
    },
    "langMap": {
      "plswait": {
        "desc": "lang khi người dùng dùng lệnh quá nhanh",
        "vi_VN": "Vui lòng dùng lệnh này sau {0} giây!",
        "en_US": "Please use this command after {0} seconds!",
        "args": {
          "{0}": {
            "vi_VN": "Giây",
            "en_US": "Seconds"
          }
        }
      },
      "work": {
        "desc": "Lang khi người dùng sài work",
        "vi_VN": ["Bạn đã đi FuHo và kiếm được {0}. Số tiền hiện có: {1}", "Bạn đã đi rửa chén thuê và kiếm được {0}. Số tiền hiện có: {1}", "Bạn đã đi đòi nợ thuê và kiếm được {0}. Số tiền hiện có: {1}", "Bạn đã đi bán vé số và kiếm được {0}. Số tiền hiện có: {1}", "Bạn làm thợ sửa ống nước và kiếm được {0}. Số tiền hiện có: {1}"],
        "en_US": ["You went side-by-side and earned {0}. Amount available: {1}", "You went to the dishwasher and earned {0}. Amount available: {1}", "You went into debt collection and earned {0}. Amount available: {1}", "You went to sell lottery tickets and earned {0}. Amount available: {1}", "You work as a plumber and earn {0}. Amount available: {1}"],
        "args": {
          "{0}": {
            "vi_VN": "Tiền vừa kiếm được",
            "en_US": "Money just earned"
          },
          "{1}": {
            "vi_VN": "Tiền hiện có",
            "en_US": "Cash available"
          }
        }
      },
      "slut": {
        "desc": "Lang khi người dùng sài slut",
        "vi_VN": ["Bạn đã làm chuyện đó với người lạ và kiếm được {0}. Số tiền hiện có: {1}", "Bạn đã làm chuyện đó với người lạ nhưng đã bị mắc bệnh, bạn đã mất {0} để chữa bệnh. Số tiền hiện có: {1}"],
        "en_US": ["You f**ked a stranger and earned {0}. Amount available: {1}", "You f**ked a stranger but got sick, you lost {0} to cure. Amount available: {1}"],
        "args": {
          "{0}": {
            "vi_VN": "Tiền vừa kiếm được",
            "en_US": "Money just earned"
          },
          "{1}": {
            "vi_VN": "Tiền hiện có",
            "en_US": "Cash available"
          }
        }
      },
      "crime": {
        "desc": "Lang khi người dùng sài crime",
        "vi_VN": ["Bạn đã cướp ngân hàng thành công và kiếm được {0}. Số tiền hiện có: {1}", "Bạn đã cướp ngân hàng nhưng đã bị cảnh sát bắt, bạn đã dùng {0} để hối lộ. Số tiền hiện có: {1}"],
        "en_US": ["You have successfully robbed a bank and earned {0}. Amount available: {1}", "You robbed a bank but got caught by the police, you used {0} as bail. Amount available: {1}"],
        "args": {
          "{0}": {
            "vi_VN": "Tiền vừa kiếm được",
            "en_US": "Money just earned"
          },
          "{1}": {
            "vi_VN": "Tiền hiện có",
            "en_US": "Cash available"
          }
        }
      },
      "wrongEcoSet": {
        "desc": "Lang khi người dùng sai format trong EcoSet",
        "vi_VN": "Sai định dạng. Vui lòng dùng \"{0}eco set <Số tiền> [@Mention]\"",
        "en_US": "Wrong format. Please use \"{0}eco set <Amount> [@Mention]\"",
        "args": {
          "{0}": {
            "vi_VN": "Prefix",
            "en_US": "Prefix"
          }
        }
      },
      "successEcoSet": {
        "desc": "Lang khi người dùng đúng format trong EcoSet",
        "vi_VN": "Đã đặt tiền của {0} thành {1}",
        "en_US": "{0} money has been set to {1}",
        "args": {
          "{0}": {
            "vi_VN": "Tên người dùng",
            "en_US": "Name User"
          },
          "{1}": {
            "vi_VN": "Số tiền",
            "en_US": "Money"
          }
        }
      },
      "wrongEcoAdd": {
        "desc": "Lang khi người dùng sai format trong EcoAdd",
        "vi_VN": "Sai định dạng. Vui lòng dùng \"{0}eco add <Số tiền> [@Mention]\"",
        "en_US": "Wrong format. Please use \"{0}eco add <Amount> [@Mention]\"",
        "args": {
          "{0}": {
            "vi_VN": "Prefix",
            "en_US": "Prefix"
          }
        }
      },
      "successEcoAdd": {
        "desc": "Lang khi người dùng đúng format trong EcoAdd",
        "vi_VN": "Đã cộng {1} cho {0}. Hiện {0} có {2}",
        "en_US": "Added {1} for {0}. {0} currently have {2}",
        "args": {
          "{0}": {
            "vi_VN": "Tên người dùng",
            "en_US": "Name User"
          },
          "{1}": {
            "vi_VN": "Số tiền",
            "en_US": "Money"
          },
          "{2}": {
            "vi_VN": "Số tiền hiện có",
            "en_US": "Cash available"
          }
        }
      },
      "wrongEcoMinus": {
        "desc": "Lang khi người dùng sai format trong EcoMinus",
        "vi_VN": "Sai định dạng. Vui lòng dùng \"{0}eco minus <Số tiền> [@Mention]\"",
        "en_US": "Wrong format. Please use \"{0}eco minus <Amount> [@Mention]\"",
        "args": {
          "{0}": {
            "vi_VN": "Prefix",
            "en_US": "Prefix"
          }
        }
      },
      "successEcoMinus": {
        "desc": "Lang khi người dùng đúng format trong EcoMinus",
        "vi_VN": "Đã trừ {1} đối với {0}. Hiện {0} có {2}",
        "en_US": "Deducted {1} from {0}. {0} now have {2}",
        "args": {
          "{0}": {
            "vi_VN": "Tên người dùng",
            "en_US": "Name User"
          },
          "{1}": {
            "vi_VN": "Số tiền",
            "en_US": "Money"
          },
          "{2}": {
            "vi_VN": "Số tiền hiện có",
            "en_US": "Cash available"
          }
        }
      },
      "wrongEco": {
        "desc": "Lang khi người dùng đúng format trong Eco",
        "vi_VN": "Sai định dạng. Vui lòng sử dụng \"{0}help eco\" để xem cách dùng.",
        "en_US": "Wrong format. Please use \"{0}help eco\" to see how to use it.",
        "args": {
          "{0}": {
            "vi_VN": "Prefix",
            "en_US": "Prefix"
          }
        }
      },
      "wrongCommand": {
        "desc": "Lang khi người dùng sai format",
        "vi_VN": "Sai định dạng. Vui lòng dùng \"{0}\"",
        "en_US": "Wrong format. Please use \"{0}\"",
        "args": {
          "{0}": {
            "vi_VN": "Lệnh",
            "en_US": "Command"
          }
        }
      },
      "noPer": {
        "desc": "Lang khi người dùng không đủ quyền",
        "vi_VN": "Không đủ quyền!",
        "en_US": "No permission!",
        "args": {}
      },
      "successTransfers": {
        "desc": "Lang khi người dùng đúng format trong chuyển tiền",
        "vi_VN": "Đã chuyển {1} cho {0}. Số tiền hiện tại của:\n -{0}: {2}\n -Bạn: {3}",
        "en_US": "Passed {1} to {0}. Current amount of:\n -{0}: {2}\n -You: {3}",
        "args": {
          "{0}": {
            "vi_VN": "Tên người dùng",
            "en_US": "Name User"
          },
          "{1}": {
            "vi_VN": "Số tiền",
            "en_US": "Money"
          },
          "{2}": {
            "vi_VN": "Số tiền hiện có của người nhận",
            "en_US": "Recipient's available amount"
          },
          "{3}": {
            "vi_VN": "Số tiền hiện có của bạn",
            "en_US": "Your available money"
          }
        }
      },
      "noMoney": {
        "desc": "Không đủ tiền.",
        "vi_VN": "Không đủ tiền. Bạn cần thêm {0} để thực hiện hành động này",
        "en_US": "Not enough money. You need to add {0} to perform this action",
        "args": {
          "{0}": {
            "vi_VN": "Số tiền",
            "en_US": "Money"
          }
        }
      },
      "bal": {
        "desc": "Số tiền",
        "vi_VN": "{0}",
        "en_US": "{0}",
        "args": {
          "{0}": {
            "vi_VN": "Số tiền",
            "en_US": "Money"
          }
        }
      },
      "baltop": {
        "desc": "Danh sách người dàu :)))",
        "vi_VN": "Danh sách người thành đạt:\n{0}\nTrang: {1}\\{2}",
        "en_US": "Rich List:\n{0}\nPage: {1}\\{2}",
        "args": {
          "{0}": {
            "vi_VN": "Danh sách",
            "en_US": "List"
          },
          "{1}": {
            "vi_VN": "Trang",
            "en_US": "Page"
          },
          "{2}": {
            "vi_VN": "Tổng số trang",
            "en_US": "Total pages"
          }
        }
      },
      "daily": {
        "desc": "Điểm danh hàng ngày",
        "vi_VN": "Bạn đã điểm danh ngày hôm nay và nhận được {daily}. Số tiền hiện có: {total}",
        "en_US": "You took attendance today and received {daily}. Current amount: {total}",
        "args": {
          "{daily}": {
            "vi_VN": "Số tiền được nhận",
            "en_US": "Amount received"
          },
          "{total}": {
            "vi_VN": "Số tiền hiện có",
            "en_US": "Current amount"
          }
        }
      },
      "reDaily": {
        "desc": "Đã điểm danh",
        "vi_VN": "Hôm nay bạn đã điểm danh rồi, hãy quay lại vào ngày mai nhé!",
        "en_US": "You've taken attendance today, come back tomorrow!",
        "args": {}
      }
    },
    "author": "HerokeyVN",
    "version": "0.1.0"
  }
}

var config = {
  work: {
    min: 100,
    max: 200,
    countdown: 15
  },
  slut: {
    min: 300,
    max: 600,
    countdown: 60
  },
  crime: {
    min: 1000,
    max: 2000,
    countdown: 180
  }
}

function work(data, api) {
  !global.data.economyConfig.work ? global.data.economyConfig.work = config.work : "";
  var random = require("random");
  var cf = global.data.economyConfig.work
  !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
    coin: 0
  } : "";
  !global.data.economy[data.senderID].work ? global.data.economy[data.senderID].work = {
    countdown: 0
  } : "";
  var time = new Date().getTime();
  var re = (time - global.data.economy[data.senderID].work.countdown) / 1000
  if (re < cf.countdown && re >= 0) {
    api.sendMessage(global.lang["Economy"].plswait[global.config.bot_info.lang].replace("{0}", cf.countdown - Math.trunc(re)), data.threadID, data.messageID);
    return;
  }//Ꮙ
  global.data.economy[data.senderID].work.countdown = time;
  var coinPlus = random.int(cf.min, cf.max);
  global.data.economy[data.senderID].coin += coinPlus;
  api.sendMessage(global.lang["Economy"].work[global.config.bot_info.lang][random.int(0, global.lang["Economy"].work[global.config.bot_info.lang].length - 1)].replace("{0}", coinPlus.toString() + global.data.economyConfig.icon).replace("{1}", global.data.economy[data.senderID].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
}

function slut(data, api) {
  !global.data.economyConfig.slut ? global.data.economyConfig.slut = config.slut : "";
  var random = require("random");
  var cf = global.data.economyConfig.slut
  !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
    coin: 0
  } : "";
  !global.data.economy[data.senderID].slut ? global.data.economy[data.senderID].slut = {
    countdown: 0
  } : "";
  var time = new Date().getTime();
  var re = (time - global.data.economy[data.senderID].slut.countdown) / 1000
  if (re < cf.countdown && re >= 0) {
    api.sendMessage(global.lang["Economy"].plswait[global.config.bot_info.lang].replace("{0}", cf.countdown - Math.trunc(re)), data.threadID, data.messageID);
    return;
  }//Ꮙ
  global.data.economy[data.senderID].slut.countdown = time;
  var coinPlus = random.int(cf.min, cf.max);
  if (random.boolean()) {
    global.data.economy[data.senderID].coin += coinPlus;
    api.sendMessage(global.lang["Economy"].slut[global.config.bot_info.lang][0].replace("{0}", coinPlus.toString() + global.data.economyConfig.icon).replace("{1}", global.data.economy[data.senderID].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
  } else {
    global.data.economy[data.senderID].coin -= coinPlus;
    api.sendMessage(global.lang["Economy"].slut[global.config.bot_info.lang][1].replace("{0}", coinPlus.toString() + global.data.economyConfig.icon).replace("{1}", global.data.economy[data.senderID].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
  }
}

function crime(data, api) {
  !global.data.economyConfig.crime ? global.data.economyConfig.crime = config.crime : "";
  var random = require("random");
  var cf = global.data.economyConfig.crime
  !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
    coin: 0
  } : "";
  !global.data.economy[data.senderID].crime ? global.data.economy[data.senderID].crime = {
    countdown: 0
  } : "";
  var time = new Date().getTime();
  var re = (time - global.data.economy[data.senderID].crime.countdown) / 1000
  if (re < cf.countdown && re >= 0) {
    api.sendMessage(global.lang["Economy"].plswait[global.config.bot_info.lang].replace("{0}", cf.countdown - Math.trunc(re)), data.threadID, data.messageID);
    return;
  }//Ꮙ
  global.data.economy[data.senderID].crime.countdown = time;
  var coinPlus = random.int(cf.min, cf.max);
  if (random.boolean()) {
    global.data.economy[data.senderID].coin += coinPlus;
    api.sendMessage(global.lang["Economy"].crime[global.config.bot_info.lang][0].replace("{0}", coinPlus.toString() + global.data.economyConfig.icon).replace("{1}", global.data.economy[data.senderID].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
  } else {
    global.data.economy[data.senderID].coin -= coinPlus;
    api.sendMessage(global.lang["Economy"].crime[global.config.bot_info.lang][1].replace("{0}", coinPlus.toString() + global.data.economyConfig.icon).replace("{1}", global.data.economy[data.senderID].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
  }
}

function eco(data, api) {
  !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
    coin: 0
  } : "";
  data.args = data.body.split(" ");
  if (global.config.facebook.admin.indexOf(data.senderID) == -1) {
    api.sendMessage(global.lang["Economy"].noPer[global.config.bot_info.lang], data.threadID, data.messageID);
    return;
  }
  switch (data.args[0]) {
    case "set": {
      ecoSet(data, api);
      break;
    }
    case "add": {
      ecoAdd(data, api);
      break;
    }
    case "minus": {
      ecoMinus(data, api);
      break;
    }
    default: {
      api.sendMessage(global.lang["Economy"].wrongEco[global.config.bot_info.lang].replace("{0}", global.config.facebook.prefix), data.threadID, data.messageID);
      break;
    }
  }
}

function ecoSet(data, api) {
  !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
    coin: 0
  } : "";
  var args = data.args
  if ((Object.keys(data.mentions)).length == 0) {
    if (!Number(args[1]) && Number(args[1]) != 0) {
      api.sendMessage(global.lang["Economy"].wrongEcoSet[global.config.bot_info.lang].replace("{0}", global.config.facebook.prefix), data.threadID, data.messageID);
      return;
    }
    global.data.economy[data.senderID].coin = Number(args[1]);
    var nameUser = global.config.bot_info.lang == "vi_VN" ? "Bạn" : "Your";
    api.sendMessage(global.lang["Economy"].successEcoSet[global.config.bot_info.lang].replace("{0}", nameUser).replace("{1}", Number(args[1]).toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
  } else {
    !global.data.economy[(Object.keys(data.mentions))[0]] ? global.data.economy[(Object.keys(data.mentions))[0]] = {
      coin: 0
    } : "";
    if (!Number(args[1]) && Number(args[1]) != 0) {
      api.sendMessage(global.lang["Economy"].wrongEcoSet[global.config.bot_info.lang].replace("{0}", global.config.facebook.prefix), data.threadID, data.messageID);
      return;
    }
    global.data.economy[(Object.keys(data.mentions))[0]].coin = Number(args[1]);
    var nameUser = data.mentions[(Object.keys(data.mentions))[0]].replace("@", "");
    api.sendMessage(global.lang["Economy"].successEcoSet[global.config.bot_info.lang].replace("{0}", nameUser).replace("{1}", Number(args[1]).toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
  }
}

function ecoAdd(data, api) {
  !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
    coin: 0
  } : "";
  var args = data.args
  if ((Object.keys(data.mentions)).length == 0) {
    if (!Number(args[1]) && Number(args[1]) != 0) {
      api.sendMessage(global.lang["Economy"].wrongEcoAdd[global.config.bot_info.lang].replace("{0}", global.config.facebook.prefix), data.threadID, data.messageID);
      return;
    }
    global.data.economy[data.senderID].coin += Number(args[1]);
    var nameUser = global.config.bot_info.lang == "vi_VN" ? "Bạn" : "Your";
    api.sendMessage(replaceAll(global.lang["Economy"].successEcoAdd[global.config.bot_info.lang], "{0}", nameUser).replace("{1}", Number(args[1]).toString() + global.data.economyConfig.icon).replace("{2}", global.data.economy[data.senderID].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
  } else {
    !global.data.economy[(Object.keys(data.mentions))[0]] ? global.data.economy[(Object.keys(data.mentions))[0]] = {
      coin: 0
    } : "";
    if (!Number(args[1]) && Number(args[1]) != 0) {
      api.sendMessage(global.lang["Economy"].wrongEcoAdd[global.config.bot_info.lang].replace("{0}", global.config.facebook.prefix), data.threadID, data.messageID);
      return;
    }
    global.data.economy[(Object.keys(data.mentions))[0]].coin += Number(args[1]);
    var nameUser = data.mentions[(Object.keys(data.mentions))[0]].replace("@", "");
    api.sendMessage(replaceAll(global.lang["Economy"].successEcoAdd[global.config.bot_info.lang], "{0}", nameUser).replace("{1}", Number(args[1]).toString() + global.data.economyConfig.icon).replace("{2}", global.data.economy[(Object.keys(data.mentions))[0]].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
  }
}

function ecoMinus(data, api) {
  !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
    coin: 0
  } : "";
  var args = data.args
  if ((Object.keys(data.mentions)).length == 0) {
    if (!Number(args[1]) && Number(args[1]) != 0) {
      api.sendMessage(global.lang["Economy"].wrongEcoMinus[global.config.bot_info.lang].replace("{0}", global.config.facebook.prefix), data.threadID, data.messageID);
      return;
    }
    global.data.economy[data.senderID].coin -= Number(args[1]);
    var nameUser = global.config.bot_info.lang == "vi_VN" ? "Bạn" : "Your";
    api.sendMessage(replaceAll(global.lang["Economy"].successEcoMinus[global.config.bot_info.lang], "{0}", nameUser).replace("{1}", Number(args[1]).toString() + global.data.economyConfig.icon).replace("{2}", global.data.economy[data.senderID].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
  } else {
    !global.data.economy[(Object.keys(data.mentions))[0]] ? global.data.economy[(Object.keys(data.mentions))[0]] = {
      coin: 0
    } : "";
    if (!Number(args[1]) && Number(args[1]) != 0) {
      api.sendMessage(global.lang["Economy"].wrongEcoMinus[global.config.bot_info.lang].replace("{0}", global.config.facebook.prefix), data.threadID, data.messageID);
      return;
    }
    global.data.economy[(Object.keys(data.mentions))[0]].coin -= Number(args[1]);
    var nameUser = data.mentions[(Object.keys(data.mentions))[0]].replace("@", "");
    api.sendMessage(replaceAll(global.lang["Economy"].successEcoMinus[global.config.bot_info.lang], "{0}", nameUser).replace("{1}", Number(args[1]).toString() + global.data.economyConfig.icon).replace("{2}", global.data.economy[(Object.keys(data.mentions))[0]].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
  }
}

function transfers(data, api) {
  !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
    coin: 0
  } : "";
  var args = data.args
  if ((Object.keys(data.mentions)).length <= 0) {
    var cm = global.config.bot_info.lang == "vi_VN" ? "<Số Tiền> <@Người nhận>" : "<Money> <@Receiver>"
    api.sendMessage(global.lang["Economy"].wrongCommand[global.config.bot_info.lang].replace("{0}", global.config.facebook.prefix + "transfers " + cm), data.threadID, data.messageID);
    return;
  } else {
    !global.data.economy[(Object.keys(data.mentions))[0]] ? global.data.economy[(Object.keys(data.mentions))[0]] = {
      coin: 0
    } : "";
    if (!Number(args[1]) && Number(args[1]) != 0) {
      var cm = global.config.bot_info.lang == "vi_VN" ? "<Số Tiền> <@Người nhận>" : "<Money> <@Receiver>"
      api.sendMessage(global.lang["Economy"].wrongCommand[global.config.bot_info.lang].replace("{0}", global.config.facebook.prefix + "transfers " + cm), data.threadID, data.messageID);
      return;
    }
    if (global.data.economy[data.senderID].coin - Number(args[1]) < 0 || Number(args[1]) < 0) {
      var coin = Number(args[1]) - global.data.economy[data.senderID].coin;
      api.sendMessage(global.lang["Economy"].noMoney[global.config.bot_info.lang].replace("{0}", coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
      return;
    }
    global.data.economy[(Object.keys(data.mentions))[0]].coin += Number(args[1]);
    global.data.economy[data.senderID].coin -= Number(args[1]);
    var nameUser = data.mentions[(Object.keys(data.mentions))[0]].replace("@", "");
    api.sendMessage(replaceAll(global.lang["Economy"].successTransfers[global.config.bot_info.lang], "{0}", nameUser).replace("{1}", Number(args[1]).toString() + global.data.economyConfig.icon).replace("{2}", global.data.economy[(Object.keys(data.mentions))[0]].coin.toString() + global.data.economyConfig.icon).replace("{3}", global.data.economy[data.senderID].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
  }
}

function bal(data, api) {
  !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
    coin: 0
  } : "";
  var args = data.args
  if ((Object.keys(data.mentions)).length > 0) {
    api.sendMessage(global.lang["Economy"].bal[global.config.bot_info.lang].replace("{0}", global.data.economy[(Object.keys(data.mentions))[0]].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
    //return;
  } else {
    api.sendMessage(global.lang["Economy"].bal[global.config.bot_info.lang].replace("{0}", global.data.economy[data.senderID].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
  }
}

async function baltop(data, api, adv) {
  var args = data.args;
  var list = [];
  var c = 0;
  var page = Number(args[1]) ? Math.trunc(Number(args[1])) : 1;
  //console.log(args[1])
  var max = 5;
  var s = "";
  for (var i in global.data.economy) {
    list[c] = i;
    c++;
  }
  for (var i = 0; i < c - 1; i++)
    for (var j = i; j < c; j++)
      if (global.data.economy[list[i]].coin < global.data.economy[list[j]].coin) {
        var t = list[i];
        list[i] = list[j];
        list[j] = t;
      }
  for (let i = max * page - max; i < max * page; i++) {
    if (!list[i]) break;
    var name = (await adv.getUserInfo(list[i]))[list[i]].name;
    s += `${i + 1}. ${name}: ${global.data.economy[list[i]].coin}${global.data.economyConfig.icon}\n`
  }
  api.sendMessage(global.lang["Economy"].baltop[global.config.bot_info.lang].replace("{0}", s).replace("{1}", page).replace("{2}", Math.trunc(list.length / max) + 1), data.threadID, data.messageID);
}

function daily(data, api, adv) {
  let {rlang, replaceMap} = adv;
  var random = require("random");
  !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
    coin: 0
  } : "";
  let date = (new Date()).toDateString().replaceAll(" ", "");
  if (global.data.economy[data.senderID].daily == date) return api.sendMessage(rlang("reDaily"), data.threadID, data.messageID);

  global.data.economy[data.senderID].daily = date;
  let daily = random.int(1000, 10000);
  global.data.economy[data.senderID].coin += daily;
  let map = {
    "{daily}": daily+global.data.economyConfig.icon,
    "{total}": global.data.economy[data.senderID].coin+global.data.economyConfig.icon
  }
  api.sendMessage(replaceMap(rlang("daily"), map), data.threadID, data.messageID);
}

function replaceAll(string, arg, rep) {
  string = string.replace(arg, rep);
  if (string.indexOf(arg) != -1) {
    string = replaceAll(string, arg, rep);
  }
  return string;
}
//
module.exports = {
  init,
  work,
  slut,
  crime,
  eco,
  transfers,
  bal,
  baltop,
  daily
}
