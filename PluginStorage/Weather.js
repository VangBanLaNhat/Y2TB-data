const axios = require("axios");
const url = require("url");

function init() {
	!global.data.weather ? (global.data.weather = {}) : "";

	return {
		pluginName: "Weather",
		pluginMain: "Weather.js",
		desc: {
			vi_VN: "Dự báo thời tiết",
			en_US: "Weather forecast",
		},
		commandList: {
			weather: {
				help: {
					vi_VN: "[thành phố]",
					en_US: "[city]",
				},
				tag: {
					vi_VN: "Lấy thông tin thời tiết của một vị trí",
					en_US: "Get the weather information about a location",
				},
				mainFunc: "weatherCommand",
				example: {
					vi_VN: "weather Hà Nội",
					en_US: "weather Tokyo",
				},
			},
		},
		langMap: {
			plssend: {
				desc: "Please send coordinate message",
				vi_VN: "Vui lòng gửi tọa độ vị trí (bạn có {0} phút)!",
				en_US: "Please send location coordinates (you have {0} minutes)!",
				args: {
					"{0}": {
						vi_VN: "Phút",
						en_US: "Min",
					},
				},
			},
			timeout: {
				desc: "Timeout send coordinate",
				vi_VN: "Đã hết thời gian gửi vị trí!",
				en_US: "Location submission timeout!",
				args: {},
			},
			unkn: {
				desc: "Unknown local",
				vi_VN: "Không thể tìm thấy vị trí này!",
				en_US: "Cannot find this location!",
				args: {},
			},
			return: {
				desc: "Return data",
				vi_VN: "Thời tiết hiện tại ở {0}:\n-Thời tiết hiện tại: {1}\n-Nhiệt độ: {2}°C (Cảm giác như: {3}°C)\n +Nhiệt độ cao nhất: {4}°C\n +Nhiệt độ thấp nhất: {5}°C\n-Độ ẩm: {6}%\n-Gió: {7}m/s",
				en_US: "Current weather at {0}:\n-Current weather: {1}\n-Temperature: {2}°C (Feels like: {3}°C)\n +Highest temperature:  {4}°C\n +Last temperature: {5}°C\n-Humidity: {6}%\n-Wind: {7}m/s",
				args: {
					"{0}": {
						vi_VN: "Thành phố",
						en_US: "City",
					},
				},
			},
		},
		nodeDepends: {},
		chathook: "chathook",
		author: "HerokeyVN",
		version: "0.0.1",
		config: {
			apiKey_openWeatherMap: "9b0401efe5c18b82655390308946b328",
		},
	};
}

function quickReply(api, message, messageData, callback) {
	return new Promise((resolve, reject) => {
		return api.sendMessage(
			messageData,
			message.threadID,
			(err, info) => {
				if (!callback) callback = () => { };

				if (err) {
					callback(err);
					return reject(err);
				}

				callback(err, info);
				return resolve(info);
			},
			message.messageID
		);
	});
}

async function fetchWeather(query, lang, apiKey) {
	let link = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}`;

	switch (typeof query) {
		case "string":
			link += `&q=${encodeURIComponent(query)}&lang=${encodeURIComponent(
				lang
			)}`;
			break;
		case "object":
			if (query.latitude && query.longitude) {
				link += `&lat=${encodeURIComponent(
					query.latitude
				)}&lon=${encodeURIComponent(
					query.longitude
				)}&lang=${encodeURIComponent(lang)}`;
			}
			break;
	}

	return (await axios(link)).data;
}

/**
 * Get the coordinates from Facebook's markers maps
 * @param {string} imageUrl the url of the image
 * @returns {{latitude: number, longitude: number}|null} coordinates of pin location in the image
 */
function getLocationFromImageUrl(imageUrl) {
	imageUrl = decodeURIComponent(
		String(url.parse(imageUrl, true).query["markers"])
	);
	imageUrl = imageUrl.split("|");

	let location = null;
	let locationRegExp =
		/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/g;

	for (let text of imageUrl) {
		if (locationRegExp.test(text)) {
			location = text.split(",");
			break;
		}
	}

	return (location && location[0] && location[1]) ? { latitude: location[0], longitude: location[1] } : null;
}

async function weatherCommand(data, api, { config }) {
	!global.data.weather[data.threadID]
		? (global.data.weather[data.threadID] = {})
		: "";

	const langMap = global.lang.Weather;
	const botLang = global.config.bot_info.lang;

	let message = data.body;
	let timeoutMinutes = 1;

	const reply = quickReply.bind(null, api, data);

	if (message.length <= 0) {
		reply(langMap.plssend[botLang].replace("{0}", timeoutMinutes));

		global.data.weather[data.threadID][data.senderID] = data.messageID;

		setTimeout(() => {
			if (global.data.weather[data.threadID][data.senderID]) {
				delete global.data.weather[data.threadID][data.senderID];
				reply(langMap.timeout[botLang]);
			}
		}, timeoutMinutes * 60 * 1000);
	} else {
		try {
			let res = await fetchWeather(
				message,
				botLang.split("_")[0],
				config.apiKey_openWeatherMap
			);

			if (res.message == "city not found") {
				reply(langMap.unkn[botLang]);
			} else if (res.message) {
				api.sendMessage(res.message, data.threadID, data.messageID);
				console.error("WEATHER ERROR:", res.message);
			} else {
				reply(
					langMap.return[botLang]
						.replace("{0}", res.name)
						.replace("{1}", res.weather[0].description)
						.replace("{2}", res.main.temp)
						.replace("{3}", res.main.feels_like)
						.replace("{4}", res.main.temp_max)
						.replace("{5}", res.main.temp_min)
						.replace("{6}", res.main.humidity)
						.replace("{7}", res.wind.speed)
				);
			}
		} catch (ex) {
			reply(langMap.unkn[botLang]);
			console.error("Weather", ex);
		}
	}
}

async function chathook(data, api, { config }) {
	if (!(data.type === "message" && data.attachments.length > 0)) return;

	const langMap = global.lang.Weather;
	const botLang = global.config.bot_info.lang;
	const reply = quickReply.bind(null, api, data);

	let attachment = data.attachments[0];
	if (!["share", "location"].includes(attachment.type) || !attachment.image) return;
	let location = getLocationFromImageUrl(attachment.image);

	if (
		global.data.weather &&
		global.data.weather[data.threadID] &&
		global.data.weather[data.threadID][data.senderID] &&
		location
	) {
		try {
			let res = await fetchWeather(
				location,
				botLang.split("_")[0],
				config.apiKey_openWeatherMap
			);

			if (res.message == "city not found") {
				reply(langMap.unkn[botLang]);
			} else if (res.message) {
				reply(res.message);
				console.error("Weather", res.message);
			} else {
				reply(
					langMap.return[botLang]
						.replace("{0}", res.name)
						.replace("{1}", res.weather[0].description)
						.replace("{2}", res.main.temp)
						.replace("{3}", res.main.feels_like)
						.replace("{4}", res.main.temp_max)
						.replace("{5}", res.main.temp_min)
						.replace("{6}", res.main.humidity)
						.replace("{7}", res.wind.speed)
				);
			}

			delete global.data.weather[data.threadID][data.senderID];
		} catch (e) {
			reply(`!!! UNKNOWN ERROR !!!`);
			delete global.data.weather[data.threadID][data.senderID];
			return console.error("Weather", e);
		}
	}
}

module.exports = {
	init,
	weatherCommand,
	chathook,
};
