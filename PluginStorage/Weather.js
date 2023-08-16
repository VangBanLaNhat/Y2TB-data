function init(){ 
     !global.data.weather ? global.data.weather = {}:""; 
     return{ 
         "pluginName": "Weather", 
         "pluginMain": "Weather.js", 
         "desc": { 
             "vi_VN": "Dự báo thời tiết", 
             "en_US": "Weather forecast" 
         }, 
         "commandList": { 
             "weather": { 
                 "help": { 
                     "vi_VN": "[Thành Phố]", 
                     "en_US": "[City]" 
                 }, 
                 "tag": { 
                     "vi_VN": "Thời tiết hôm nay", 
                     "en_US": "Weather today" 
                 }, 
                 "mainFunc": "wth", 
                 "example": { 
                     "vi_VN": "weather Hà Nội", 
                     "en_US": "weather Tokyo" 
                 } 
             } 
         }, 
         "langMap":{ 
             "plssend": { 
                 "desc": "Please send coordinate message", 
                 "vi_VN": "Vui lòng gửi tọa độ vị trí (Bạn có {0} phút)!", 
                 "en_US": "Please send location coordinates (You have {0} minutes)!", 
                 "args": { 
                     "{0}": { 
                         "vi_VN": "Phút", 
                         "en_US": "Min" 
                     } 
                 } 
             }, 
             "timeout": { 
                 "desc": "Timeout send coordinate", 
                 "vi_VN": "Đã hết thời gian gửi vị trí!", 
                 "en_US": "Location submission timeout!", 
                 "args": {} 
             }, 
             "unkn": { 
                 "desc": "Unknown local", 
                 "vi_VN": "Vị trí không tồn tại!", 
                 "en_US": "Location does not exist!", 
                 "args": {} 
             }, 
             "return": { 
                 "desc": "Return data", 
                 "vi_VN": "Thời tiết hiện tại ở {0}:\n-Thời tiết hiện tại: {1}\n-Nhiệt độ: {2}°C (Cảm giác như: {3}°C)\n +Nhiệt độ cao nhất: {4}°C\n +Nhiệt độ thấp nhất: {5}°C\n-Độ ẩm: {6}%\n-Gió: {7}m/s", 
                 "en_US": "Current weather at {0}:\n-Current weather: {1}\n-Temperature: {2}°C (Feels like: {3}°C)\n +Highest temperature:  {4}°C\n +Last temperature: {5}°C\n-Humidity: {6}%\n-Wind: {7}m/s", 
                 "args": { 
                     "{0}": { 
                         "vi_VN": "Thành phố", 
                         "en_US": "City" 
                     } 
                 } 
             } 
         }, 
         "nodeDepends": {}, 
         "chathook": "rslc", 
         "author": "HerokeyVN", 
         "version": "0.0.1",
         "config": {
         	"apiKey_openWeatherMap": "17bb6afb9c46bbee42211f1c3e975103"
         }
     } 
 } 
  
 async function wth(data, api, adv){ 
     !global.data.weather[data.threadID] ? global.data.weather[data.threadID] = {}:""; 
  
	const {config} = adv;
     var lang = global.lang.Weather; 
     var lc = global.config.bot_info.lang 
     var msg = data.body; 
     console.log(msg); 
  
     var min = 1; 
     /*if (global.data.weather[data.threadID][data.senderID]) api.sendMessage(lang.plssend[lc].replace("{0}", min), data.threadID, data.messageID) 
     else */if (msg.length <= 0) { 
         api.sendMessage(lang.plssend[lc].replace("{0}", min), data.threadID, data.messageID); 
  
         global.data.weather[data.threadID][data.senderID] = data.messageID; 
         setTimeout(function() { 
             if(global.data.weather[data.threadID][data.senderID]){ 
                 delete global.data.weather[data.threadID][data.senderID]; 
                 api.sendMessage(lang.timeout[lc], data.threadID, data.messageID); 
             } 
         }, min*60*1000); 
     } else { 
         try{ 
             var axios = require("axios"); 
             
             var link = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(msg)}&lang=${global.config.bot_info.lang.split("_")[0]}&units=metric&appid=${config.apiKey_openWeatherMap}`; 
           try{ 
             var fdt = (await axios(link)).data 
           }catch(e){ 
             api.sendMessage(e.response.data.message, data.threadID, data.messageID); 
             return console.error("Weather", e); 
           } 
             if (fdt.message == "city not found"){ 
                 api.sendMessage(lang.unkn[lc], data.threadID, data.messageID); 
             } else if (fdt.message){ 
                 api.sendMessage(fdt.message, data.threadID, data.messageID); 
                 console.error("Weather", fdt.message); 
             } else { 
                 var rt = lang.return[lc].replace("{0}", fdt.name).replace("{1}", fdt.weather[0].description).replace("{2}", fdt.main.temp).replace("{3}", fdt.main.feels_like).replace("{4}", fdt.main.temp_max).replace("{5}", fdt.main.temp_min).replace("{6}", fdt.main.humidity).replace("{7}", fdt.wind.speed) 
                 api.sendMessage(rt, data.threadID, data.messageID); 
             } 
         } catch (e){ 
             api.sendMessage(lang.unkn[lc], data.threadID, data.messageID); 
             console.error("Weather", e) 
         } 
     } 
 } 
  
 async function rslc(data, api, adv){ 
     if(data.type == "message" && data.attachments[0]) if(data.attachments[0].type == "share") if(global.data.weather[data.threadID][data.senderID]){ 
     	const {config} = adv;
         var lang = global.lang.Weather; 
         var lc = global.config.bot_info.lang 
  
         var axios = require("axios"); 
         var link = `https://api.openweathermap.org/data/2.5/weather?lat=${data.attachments[0].target.coordinate.latitude}&lon=${data.attachments[0].target.coordinate.longitude}&lang=${global.config.bot_info.lang.split("_")[0]}&units=metric&appid=${config.apiKey_openWeatherMap}`; 
         try{ 
           var fdt = (await axios(link)).data 
         }catch(e){ 
           api.sendMessage(e.response.data.message, data.threadID, data.messageID); 
           return console.error("Weather", e); 
         } 
         if (fdt.message == "city not found"){ 
             api.sendMessage(lang.unkn[lc], data.threadID, global.data.weather[data.threadID][data.senderID]); 
         } else if (fdt.message){ 
             api.sendMessage(fdt.message, data.threadID, global.data.weather[data.threadID][data.senderID]); 
             console.error("Weather", fdt.message); 
         } else { 
             var rt = lang.return[lc].replace("{0}", fdt.name).replace("{1}", fdt.weather[0].description).replace("{2}", fdt.main.temp).replace("{3}", fdt.main.feels_like).replace("{4}", fdt.main.temp_max).replace("{5}", fdt.main.temp_min).replace("{6}", fdt.main.humidity).replace("{7}", fdt.wind.speed) 
             api.sendMessage(rt, data.threadID, global.data.weather[data.threadID][data.senderID]); 
         } 
         delete global.data.weather[data.threadID][data.senderID]; 
     } 
 } 
  
 module.exports = { 
     init, 
     wth, 
     rslc 
 }