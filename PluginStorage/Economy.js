function init(){
    //!global.data.economyConfig ? global.data.economyConfig = {icon: "Ꮙ"}:"";
    //!global.data.economy ? global.data.economy = {}:"";
    return true;
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
    !global.data.economyConfig.work ? global.data.economyConfig.work = config.work:"";
    var random = require("random");
    var cf = global.data.economyConfig.work
    !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
        coin: 0
    }:"";
    !global.data.economy[data.senderID].work ? global.data.economy[data.senderID].work = {
        countdown: 0
    }:"";
    var time = new Date().getTime();
    var re = (time - global.data.economy[data.senderID].work.countdown)/1000
    if(re < cf.countdown&&re >= 0){
        api.sendMessage(global.lang["Economy"].plswait[global.config.bot_info.lang].replace("{0}", cf.countdown-Math.trunc(re)), data.threadID, data.messageID);
        return;
    }//Ꮙ
    global.data.economy[data.senderID].work.countdown = time;
    var coinPlus = random.int(cf.min, cf.max);
    global.data.economy[data.senderID].coin += coinPlus;
    api.sendMessage(global.lang["Economy"].work[global.config.bot_info.lang][random.int(0, global.lang["Economy"].work[global.config.bot_info.lang].length-1)].replace("{0}", coinPlus.toString()+global.data.economyConfig.icon).replace("{1}", global.data.economy[data.senderID].coin.toString()+global.data.economyConfig.icon), data.threadID, data.messageID);
}

function slut(data, api) {
    !global.data.economyConfig.slut ? global.data.economyConfig.slut = config.slut:"";
    var random = require("random");
    var cf = global.data.economyConfig.slut
    !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
        coin: 0
    }:"";
    !global.data.economy[data.senderID].slut ? global.data.economy[data.senderID].slut = {
        countdown: 0
    }:"";
    var time = new Date().getTime();
    var re = (time - global.data.economy[data.senderID].slut.countdown)/1000
    if(re < cf.countdown&&re >= 0){
        api.sendMessage(global.lang["Economy"].plswait[global.config.bot_info.lang].replace("{0}", cf.countdown-Math.trunc(re)), data.threadID, data.messageID);
        return;
    }//Ꮙ
    global.data.economy[data.senderID].slut.countdown = time;
    var coinPlus = random.int(cf.min, cf.max);
    if(random.boolean()){
        global.data.economy[data.senderID].coin += coinPlus;
        api.sendMessage(global.lang["Economy"].slut[global.config.bot_info.lang][0].replace("{0}", coinPlus.toString()+global.data.economyConfig.icon).replace("{1}", global.data.economy[data.senderID].coin.toString()+global.data.economyConfig.icon), data.threadID, data.messageID);
    } else {
        global.data.economy[data.senderID].coin -= coinPlus;
        api.sendMessage(global.lang["Economy"].slut[global.config.bot_info.lang][1].replace("{0}", coinPlus.toString()+global.data.economyConfig.icon).replace("{1}", global.data.economy[data.senderID].coin.toString()+global.data.economyConfig.icon), data.threadID, data.messageID);
    }
}

function crime(data, api) {
    !global.data.economyConfig.crime ? global.data.economyConfig.crime = config.crime:"";
    var random = require("random");
    var cf = global.data.economyConfig.crime
    !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
        coin: 0
    }:"";
    !global.data.economy[data.senderID].crime ? global.data.economy[data.senderID].crime = {
        countdown: 0
    }:"";
    var time = new Date().getTime();
    var re = (time - global.data.economy[data.senderID].crime.countdown)/1000
    if(re < cf.countdown&&re >= 0){
        api.sendMessage(global.lang["Economy"].plswait[global.config.bot_info.lang].replace("{0}", cf.countdown-Math.trunc(re)), data.threadID, data.messageID);
        return;
    }//Ꮙ
    global.data.economy[data.senderID].crime.countdown = time;
    var coinPlus = random.int(cf.min, cf.max);
    if(random.boolean()){
        global.data.economy[data.senderID].coin += coinPlus;
        api.sendMessage(global.lang["Economy"].crime[global.config.bot_info.lang][0].replace("{0}", coinPlus.toString()+global.data.economyConfig.icon).replace("{1}", global.data.economy[data.senderID].coin.toString()+global.data.economyConfig.icon), data.threadID, data.messageID);
    } else {
        global.data.economy[data.senderID].coin -= coinPlus;
        api.sendMessage(global.lang["Economy"].crime[global.config.bot_info.lang][1].replace("{0}", coinPlus.toString()+global.data.economyConfig.icon).replace("{1}", global.data.economy[data.senderID].coin.toString()+global.data.economyConfig.icon), data.threadID, data.messageID);
    }
}

function eco(data,api) {
    !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
        coin: 0
    }:"";
    data.args = data.body.split(" ");
    if(global.config.facebook.admin.indexOf(data.senderID) == -1){
        api.sendMessage(global.lang["Economy"].noPer[global.config.bot_info.lang], data.threadID, data.messageID);
        return;
    }
    switch (data.args[0]){
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
        default:{
            api.sendMessage(global.lang["Economy"].wrongEco[global.config.bot_info.lang].replace("{0}",global.config.facebook.prefix), data.threadID, data.messageID);
            break;
        }
    }
}

function ecoSet(data, api) {
    !global.data.economy[data.senderID] ? global.data.economy[data.senderID] = {
        coin: 0
    }:"";
    var args = data.args
    if((Object.keys(data.mentions)).length == 0){
        if(!Number(args[1]) && Number(args[1]) != 0){
            api.sendMessage(global.lang["Economy"].wrongEcoSet[global.config.bot_info.lang].replace("{0}",global.config.facebook.prefix), data.threadID, data.messageID);
            return;
        }
        global.data.economy[data.senderID].coin = Number(args[1]);
        var nameUser = global.config.bot_info.lang == "vi_VN" ? "Bạn":"Your";
        api.sendMessage(global.lang["Economy"].successEcoSet[global.config.bot_info.lang].replace("{0}", nameUser).replace("{1}", Number(args[1]).toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
    } else {
        !global.data.economy[(Object.keys(data.mentions))[0]] ? global.data.economy[(Object.keys(data.mentions))[0]] = {
            coin: 0
        }:"";
        if(!Number(args[1]) && Number(args[1]) != 0){
            api.sendMessage(global.lang["Economy"].wrongEcoSet[global.config.bot_info.lang].replace("{0}",global.config.facebook.prefix), data.threadID, data.messageID);
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
    }:"";
    var args = data.args
    if((Object.keys(data.mentions)).length == 0){
        if(!Number(args[1]) && Number(args[1]) != 0){
            api.sendMessage(global.lang["Economy"].wrongEcoAdd[global.config.bot_info.lang].replace("{0}",global.config.facebook.prefix), data.threadID, data.messageID);
            return;
        }
        global.data.economy[data.senderID].coin += Number(args[1]);
        var nameUser = global.config.bot_info.lang == "vi_VN" ? "Bạn":"Your";
        api.sendMessage(replaceAll(global.lang["Economy"].successEcoAdd[global.config.bot_info.lang], "{0}", nameUser).replace("{1}", Number(args[1]).toString() + global.data.economyConfig.icon).replace("{2}", global.data.economy[data.senderID].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
    } else {
        !global.data.economy[(Object.keys(data.mentions))[0]] ? global.data.economy[(Object.keys(data.mentions))[0]] = {
            coin: 0
        }:"";
        if(!Number(args[1]) && Number(args[1]) != 0){
            api.sendMessage(global.lang["Economy"].wrongEcoAdd[global.config.bot_info.lang].replace("{0}",global.config.facebook.prefix), data.threadID, data.messageID);
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
    }:"";
    var args = data.args
    if((Object.keys(data.mentions)).length == 0){
        if(!Number(args[1]) && Number(args[1]) != 0){
            api.sendMessage(global.lang["Economy"].wrongEcoMinus[global.config.bot_info.lang].replace("{0}",global.config.facebook.prefix), data.threadID, data.messageID);
            return;
        }
        global.data.economy[data.senderID].coin -= Number(args[1]);
        var nameUser = global.config.bot_info.lang == "vi_VN" ? "Bạn":"Your";
        api.sendMessage(replaceAll(global.lang["Economy"].successEcoMinus[global.config.bot_info.lang], "{0}", nameUser).replace("{1}", Number(args[1]).toString() + global.data.economyConfig.icon).replace("{2}", global.data.economy[data.senderID].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
    } else {
        !global.data.economy[(Object.keys(data.mentions))[0]] ? global.data.economy[(Object.keys(data.mentions))[0]] = {
            coin: 0
        }:"";
        if(!Number(args[1]) && Number(args[1]) != 0){
            api.sendMessage(global.lang["Economy"].wrongEcoMinus[global.config.bot_info.lang].replace("{0}",global.config.facebook.prefix), data.threadID, data.messageID);
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
    }:"";
    var args = data.args
    if((Object.keys(data.mentions)).length <= 0){
        var cm = global.config.bot_info.lang == "vi_VN" ? "<Số Tiền> <@Người nhận>":"<Money> <@Receiver>"
        api.sendMessage(global.lang["Economy"].wrongCommand[global.config.bot_info.lang].replace("{0}",global.config.facebook.prefix+"transfers "+cm), data.threadID, data.messageID);
        return;
    } else {
        !global.data.economy[(Object.keys(data.mentions))[0]] ? global.data.economy[(Object.keys(data.mentions))[0]] = {
            coin: 0
        }:"";
        if(!Number(args[1]) && Number(args[1]) != 0){
            var cm = global.config.bot_info.lang == "vi_VN" ? "<Số Tiền> <@Người nhận>":"<Money> <@Receiver>"
            api.sendMessage(global.lang["Economy"].wrongCommand[global.config.bot_info.lang].replace("{0}",global.config.facebook.prefix+"transfers "+cm), data.threadID, data.messageID);
            return;
        }
        if(global.data.economy[data.senderID].coin - Number(args[1])<0 || Number(args[1])<0){
            var coin = Number(args[1])-global.data.economy[data.senderID].coin;
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
    }:"";
    var args = data.args
    if((Object.keys(data.mentions)).length > 0){
        api.sendMessage(global.lang["Economy"].bal[global.config.bot_info.lang].replace("{0}", global.data.economy[(Object.keys(data.mentions))[0]].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
        //return;
    } else {
        api.sendMessage(global.lang["Economy"].bal[global.config.bot_info.lang].replace("{0}", global.data.economy[data.senderID].coin.toString() + global.data.economyConfig.icon), data.threadID, data.messageID);
    }
}

async function baltop(data, api) {
    var args = data.args;
    var list = [];
    var c = 0;
    var page = Number(args[1]) ? Math.trunc(Number(args[1])):1;
    //console.log(args[1])
    var max = 5;
    var s = "";
    for(var i in global.data.economy){
        list[c] = i;
        c++;
    }
    for(var i = 0; i<c-1; i++)
        for(var j = i; j<c; j++)
            if(global.data.economy[list[i]].coin<global.data.economy[list[j]].coin){
                var t = list[i];
                list[i] = list[j];
                list[j] = t;
            }
    for(let i = max*page-max; i<max*page; i++){
        if(!list[i]) break;
        var name = (await api.getUserInfo(list[i]))[list[i]].name;
        s += `${i+1}. ${name}: ${global.data.economy[list[i]].coin}${global.data.economyConfig.icon}\n`
    }
    api.sendMessage(global.lang["Economy"].baltop[global.config.bot_info.lang].replace("{0}", s).replace("{1}", page).replace("{2}", Math.trunc(list.length/max) + 1), data.threadID, data.messageID);
}

function replaceAll(string, arg, rep) {
    string = string.replace(arg, rep);
    if(string.indexOf(arg) != -1) {
        string = replaceAll(string, arg, rep);
    }
    return string;
}
//
module.exports={
    init,
    work,
    slut,
    crime,
    eco,
    transfers,
    bal,
    baltop
}
