var path = require('path');
var fs = require('fs');

function init() {
        !global.data.xpc ? (global.data.xpc = {}) : '';
        ensureExists(path.join(__dirname, 'cache', 'XPchat'));
        return {
                pluginName: 'XPchat',
                pluginMain: 'XPChat.js',
                desc: {
                        vi_VN: 'Rankcard',
                        en_US: 'Rankcard'
                },
                commandList: {
                        rank: {
                                help: {
                                        vi_VN: '[background <Số>] || [font]',
                                        en_US: '[background <Number>] || [font]'
                                },
                                tag: {
                                        vi_VN: 'Cho bạn Rank Card',
                                        en_US: 'Get Rank Card'
                                },
                                example: {
                                        vi_VN: 'rank',
                                        en_US: 'rank'
                                },
                                mainFunc: 'mainrc'
                        },
                        xp: {
                                help: {
                                        vi_VN: '',
                                        en_US: ''
                                },
                                tag: {
                                        vi_VN: 'XPchat',
                                        en_US: 'XPchat'
                                },
                                mainFunc: 'checkxp'
                        }
                },
                chathook: 'xps',
                obb: 'XPchat',
                nodeDepends: {
                        jimp: '',
                        text2png: ''
                },
                config: {
                        "facebook_token": "1073911769817594|aa417da57f9e260d1ac1ec4530b417de"
                },
                author: 'HerokeyVN',
                version: '0.0.2'
        };
}

function ensureExists(path, mask) {
        var fs = require('fs');
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

function getinfo(cmsg) {
        var lv = 1;
        var maxxp = 10;
        var after = 1;
        var cc = 1;
        while (maxxp < cmsg) {
                cc = maxxp;
                maxxp += lv * 5;
                lv += 1;
                if (maxxp >= cmsg) after = cc;
        }
        return {
                maxxp: maxxp,
                lv: lv,
                after: after
        };
}

function globalrank(xp) {
        var rank = 0;
        for (var id in global.data.xpc) {
                if (global.data.xpc[id].xp > xp) rank += 1;
        }
        return rank;
}

async function grouprank(xp, threadID, api) {
        var rank = 0;
        try {
                var info = await api.getThreadInfo(threadID);
                var ids = info.participantIDs;
                for (var id of ids) {
                        if (global.data.xpc[id] && global.data.xpc[id].xp > xp) rank += 1;
                }
        } catch (e) {
                console.error('XPchat', e);
        }
        return rank;
}

function checkxp(data, api, adv) {
        var info = getinfo(global.data.xpc[data.senderID].xp);
        var lv = info.lv;
        var maxxp = info.maxxp;
        api.sendMessage(
                `Level: ${lv}\nXP: ${global.data.xpc[data.senderID].xp}\nYou have ${maxxp -
                global.data.xpc[data.senderID].xp} more messages to go to level ${lv +
                1}`,
                data.threadID,
                data.messageID
        );
}

function mainrc(data, api, adv) {
        //delete global.data.rankcard[data.threadID] 
        !global.data.rankcard ? (global.data.rankcard = {}) : '';

        !global.data.rankcard[data.senderID]
                ? (global.data.rankcard[data.senderID] = {
                        fontColor: '#ffffff',
                        background: 1
                })
                : '';
        switch (data.args[1]) {
                case 'background':
                        chbg(data, api, adv);
                        break;
                case 'font':
                        chfont(data, api, adv);
                        break;
                default:
                        rankc(data, api, adv);
        }
}

function chbg(data, api) {
        var arrbg = scanfile(path.join(__dirname, 'obb', 'XPchat', 'background'));
        var ch = false;
        if (data.messageReply)
                if (data.messageReply.attachments)
                        if (data.messageReply.attachments[0].type == 'photo') ch = true;
        if (
                !ch &&
                (!Number(data.args[2]) ||
                        Number(data.args[2]) - 1 < 0 ||
                        Number(data.args[2]) - 1 > arrbg.length - 1)
        ) {
                var stream = [];
                for (var name of arrbg) {
                        var str = fs.createReadStream(
                                path.join(__dirname, 'obb', 'XPchat', 'background', name)
                        );
                        stream.push(str);
                }
                var rt = {
                        body: `Image code does not exist!\n-Here are some images you can choose as wallpaper.\n-To choose a wallpaper please type "${global.config.facebook.prefix
                                }rank background "<Number image || Picture reply>". For example, to choose the number 1 image as wallpaper, we type: \n${global.config.facebook.prefix
                                }rank background 1`,
                        attachment: stream
                };
                api.sendMessage(
                        rt,
                        data.threadID,
                        e => {
                                if (e) {
                                        console.error('XPchat', e);
                                        api.sendMessage(e.error, data.threadID, data.messageID);
                                }
                        },
                        data.messageID
                );
        } else if (
                Number(data.args[2]) &&
                Number(data.args[2]) - 1 >= 0 &&
                Number(data.args[2]) - 1 <= arrbg.length - 1
        ) {
                global.data.rankcard[data.senderID].background = Number(data.args[2]);
                var rt = `Selected picture number ${data.args[2]} as wallpaper!`;
                api.sendMessage(rt, data.threadID, data.messageID);
        } else {
                global.data.rankcard[data.senderID].background =
                        data.messageReply.attachments[0].url;
                var rt = `Selected your picture as wallpaper!`;
                api.sendMessage(rt, data.threadID, data.messageID);
        }
}

function chfont(data, api) {
        var st = data.args[2];
        if (!st) {
                var rt = `Current font color: ${global.data.rankcard[data.senderID].fontColor
                        }\n-To change the font color, type: ${global.config.facebook.prefix
                        }rank font <default || theme || white, red, blue,... || #ffffff, #8394eb, #eb8384,... || rgb(0, 0, 0, 1)>\n-For example, to change font color by theme, type:\n${global.config.facebook.prefix
                        }rank font theme.`;
                api.sendMessage(rt, data.threadID, data.messageID);
        } else {
                if (st.toLowerCase() == 'default')
                        global.data.rankcard[data.senderID].fontColor = '#ffffff';
                else global.data.rankcard[data.senderID].fontColor = st;
                rt = `Changed the font color to: ${st}`;
                api.sendMessage(rt, data.threadID, data.messageID);
        }
}

async function rankc(data, api, adv) {
        var x = Number(data.args[1]);
        var y = Number(data.args[2]);
        var z = Number(data.args[3]);
        var a = Number(data.args[4]);
        !global.data.rankcard ? (global.data.rankcard = {}) : '';
        !global.data.rankcard[data.senderID]
                ? (global.data.rankcard[data.senderID] = {
                        fontColor: '#ffffff',
                        background: 1
                })
                : '';

        var themecl = '#8394eb';
        var rankcl = '#101636';

        var bgl =
                typeof global.data.rankcard[data.senderID].background == 'string'
                        ? global.data.rankcard[data.senderID].background
                        : global.data.rankcard[data.senderID].background - 1;
        var arrbg = scanfile(path.join(__dirname, 'obb', 'XPchat', 'background'));

        var map = {
                rank_bg: path.join(__dirname, 'obb', 'XPchat', 'rank_bg.png'),
                bar_bg: path.join(__dirname, 'obb', 'XPchat', 'bar_bg.png'),
                rankcard: path.join(__dirname, 'cache', 'XPchat', data.messageID + '.jpg')
        };

        var fs = require('fs');
        var jimp = (require('jimp')).Jimp;
        var t2p = require('text2png');

        var xp = global.data.xpc[data.senderID].xp;
        var info = getinfo(xp);
        var lv = info.lv;
        var maxxp = info.maxxp;
        var aftxp = info.after;

        if (lv < 10) {
                themecl = '#EBBA83';
                rankcl = '#362810';
        } else if (lv < 20) {
                themecl = '#8394eb';
                rankcl = '#101636';
        } else if (lv < 30) {
                themecl = '#EBD783';
                rankcl = '#363210';
        } else if (lv < 35) {
                themecl = '#83EBE9';
                rankcl = '#103632';
        } else if (lv < 45) {
                themecl = '#83EB86';
                rankcl = '#113610';
        } else {
                themecl = '#EB8384';
                rankcl = '#361010';
        }

        var fontcl = global.data.rankcard[data.senderID].fontColor.toLowerCase() == 'theme' ? themecl : global.data.rankcard[data.senderID].fontColor;

        if (typeof global.data.rankcard[data.senderID].background == 'string') {
                //console.log('0', global.data.rankcard[data.senderID].background); 
                try {
                        var bg = await jimp.read(global.data.rankcard[data.senderID].background);
                } catch (e) {
                        global.data.rankcard[data.senderID].background = 1;
                        var bg = await jimp.read(
                                path.join(__dirname, 'obb', 'XPchat', 'background', arrbg[0])
                        );
                }
        } else if (arrbg) {

                try {
                        //console.log("1.0"); 
                        var bg = await jimp.read(
                                path.join(__dirname, 'obb', 'XPchat', 'background', arrbg[bgl])
                        );
                        //console.log("1.1;"); 
                } catch (e) {
                        console.error(e);
                }
                //console.log('1'); 
        } else {
                //console.log('2'); 
                var bg = await jimp.read(
                        path.join(__dirname, 'obb', 'XPchat', 'background', arrbg[0])
                );
                global.data.rankcard[data.senderID].background = 0;
        }
        bg.resize({ width: 400, height: 121 });

        var rank_bg = await jimp.read(map.rank_bg);
        var bg_avt = await new jimp(90, 90, themecl);
        bg_avt.circle();

        var mask = await jimp.read(map.bar_bg);
        var bar_bg = await new jimp(245, 20, rankcl);
        var bar_rank = await new jimp(245, 20, themecl);
        bar_bg.mask(mask, 0, 0);
        bar_rank.mask(mask, 0, 0);
        bar_rank.resize({ width: ((xp - aftxp) / (maxxp - aftxp)) * 245, height: 20 });

        var pt = await jimp.read(
                t2p(`${Math.trunc(((xp - aftxp) / (maxxp - aftxp)) * 100)}%`, {
                        font: '16px Futura',
                        localFontPath: path.join(
                                __dirname,
                                'obb',
                                'XPchat',
                                'font',
                                'Futura.TTF'
                        ),
                        localFontName: 'Futura',
                        color: '#fff'
                })
        );
        var lvt = await jimp.read(
                t2p(`Level: ${lv}`, {
                        font: '16px Futura',
                        localFontPath: path.join(
                                __dirname,
                                'obb',
                                'XPchat',
                                'font',
                                'Futura.TTF'
                        ),
                        localFontName: 'Futura',
                        color: fontcl
                })
        );

        var tt = await jimp.read(
                t2p(`${xp - aftxp}/${maxxp - aftxp}`, {
                        font: '8px Futura',
                        localFontPath: path.join(
                                __dirname,
                                'obb',
                                'XPchat',
                                'font',
                                'Futura.TTF'
                        ),
                        localFontName: 'Futura',
                        color: fontcl
                })
        );

        console.log('XPchat', 'Get user info...');
        var uinfo = await adv.getUserInfo(data.senderID);
        var fontsize = 21;
        var fonty = 29;
        if (uinfo.name.length < 12) {
                fontsize = 21;
                fonty = 29;
        } else if (uinfo.name.length < 15) {
                fontsize = 16;
                fonty = 34;
        } else if (uinfo.name.length < 22) {
                fontsize = 11;
                fonty = 39;
        } else if (uinfo.name.length < 30) {
                fontsize = 8;
                fonty = 42;
        } else {
                fontsize = 5;
                fonty = 45;
        }
        var nameuser = await jimp.read(
                t2p(uinfo.name, {
                        font: `${fontsize}px Futura`,
                        localFontPath: path.join(
                                __dirname,
                                'obb',
                                'XPchat',
                                'font',
                                'Futura.TTF'
                        ),
                        localFontName: 'Futura',
                        color: fontcl
                })
        );

        var grrank = await grouprank(xp, data.threadID, api);
        var grrankt = await jimp.read(
                t2p(`Rank: #${grrank}`, {
                        font: '16px Futura',
                        localFontPath: path.join(
                                __dirname,
                                'obb',
                                'XPchat',
                                'font',
                                'Futura.TTF'
                        ),
                        localFontName: 'Futura',
                        color: fontcl
                })
        );

        var glrank = await jimp.read(
                t2p(`Global Rank: #${globalrank(xp)}`, {
                        font: '8px Futura',
                        localFontPath: path.join(
                                __dirname,
                                'obb',
                                'XPchat',
                                'font',
                                'Futura.TTF'
                        ),
                        localFontName: 'Futura',
                        color: fontcl
                })
        );

        let tokenFB = adv.config.facebook_token;

        console.log('XPchat', 'Loading avatar...');
        try {
                var avatar = await jimp.read(
                        `https://graph.facebook.com/${data.senderID
                        }/picture?height=85&width=85&access_token=${tokenFB}`
                );
        } catch (e) {
                console.error('XP Chat', 'Facebook token is die!');
                try {
                        var avatar = await jimp.read(uinfo.thumbSrc);
                        avatar.resize({ width: 86, height: 86 })

                } catch (e) {
                        delete global.userInfo[data.senderID];
                        var avatar = await jimp.read(`https://graph.facebook.com/${data.senderID}/picture?height=85&width=85`);
                }

        }
        avatar.circle();

        console.log('XPchat', 'Getting RankCard...');
        var xgrr = 310 - `${grrank}`.length * 10;
        await bg
                .composite(rank_bg, 0, 0)
                .composite(bg_avt, 22.3, 16.3)
                .composite(avatar, 24.3, 18.3)
                .composite(bar_bg, 127, 85)
                .composite(bar_rank, 127, 85)
                .composite(
                        pt,
                        277 - `${Math.trunc(((xp - aftxp) / maxxp) * 100)}%`.length * 16,
                        89
                )
                .composite(lvt, 127, 67.5)
                .composite(tt, 390 - `${xp - aftxp}/${maxxp - aftxp}`.length * 8, 70)
                .composite(nameuser, 125, fonty)
                .composite(grrankt, xgrr, 35)
                .composite(glrank, xgrr + 2, 49);
        bg.resize({ width: 800, height: 242 });
        bg.write(map.rankcard, () => {
                api.sendMessage(
                        { attachment: fs.createReadStream(map.rankcard) },
                        data.threadID,
                        e => {
                                fs.unlinkSync(map.rankcard);
                                if (e) {
                                        console.error('XPchat', e);
                                        api.sendMessage(e.error, data.threadID, data.messageID);
                                }
                        },
                        data.messageID
                );
        });
}

function scanfile(dir) {
        var dirfile = fs.readdirSync(dir);
        var arr = [];
        for (var i = 0; i < dirfile.length; i++) {
                if (fs.lstatSync(path.join(dir, dirfile[i])).isFile()) {
                        arr.push(dirfile[i]);
                }
        }
        return arr;
}

function xps(data, api) {
        if (data.type == 'message' || 'message_reply') {
                if (data.senderID != undefined) {
                        !global.data.xpc[data.senderID]
                                ? (global.data.xpc[data.senderID] = {
                                        xp: 0
                                })
                                : '';
                        global.data.xpc[data.senderID].xp += 1;
                }
        }
}

module.exports = {
        checkxp,
        mainrc,
        xps,
        init
};