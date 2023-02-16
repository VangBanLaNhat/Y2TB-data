function init(){
    return{
        "pluginName": "ChemicalEquationBalancer",
        "pluginMain": "CEB.js",
        "desc": {
            "vi_VN": "Cân bằng phương trình hóa học",
            "en_US": "Balance chemical equations"
        },
        "commandList": {
            "chebal": {
                "help": {
                    "vi_VN": "<Phương trình cần cân bằng>",
                    "en_US": "<An equation needed to be balanced>"
                },
                "tag": {
                    "vi_VN": "Cân bằng 1 phương trình hoá học",
                    "en_US": "Balance a chemical equation"
                },
                "mainFunc": "balance",
                "example": {
                    "vi_VN": "chebal H2+O2=H2O",
                    "en_US": "chebal H2+O2=H2O"
                }
            }
        },
        "obb": "ChemicalEquationBalancer",
        "nodeDepends":{
            "jsdom": ""
        },
        "author": "UIRI",
        "version": "0.1"
    }
}

var mapReplace = function mapReplace(map, str) {
	for (let original in map) {
        str = str.replace(new RegExp(original.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"), "g"), map[original]);
	}
	return str;
}

var subscript = function subscript(nulled, str) {
	let mapping = {
		"0": "₀",
		"1": "₁",
		"2": "₂",
		"3": "₃",
		"4": "₄",
		"5": "₅",
		"6": "₆",
		"7": "₇",
		"8": "₈",
		"9": "₉"
	}
	return mapReplace(mapping, str);
}

var superscript = function superscript(nulled, str) {
	let mapping = {
		"0": "⁰",
		"1": "¹",
		"2": "²",
		"3": "³",
		"4": "⁴",
		"5": "⁵",
		"6": "⁶",
		"7": "⁷",
		"8": "⁸",
		"9": "⁹",
		"+": "⁺",
		"−": "⁻"
	}
	return mapReplace(mapping, str);
}

function convert(str) {
	let mapping = {"CL": "Cl", "NA": "Na", "HE": "He", "LI": "Li", "BE": "Be", "NE": "Ne", "MG": "Mg", "AL": "Al", "SI": "Si", "AR": "Ar", "CA": "Ca", "SC": "Sc", "TI": "Ti", "CR": "Cr", "MN": "Mn", "FE": "Fe", "CO": "Co", "NI": "Ni", "CU": "Cu", "ZN": "Zn", "GA": "Ga", "GE": "Ge", "AS": "As", "SE": "Se", "BR": "Br", "KR": "Kr", "RB": "Rb", "SR": "Sr", "ZR": "Zr", "NB": "Nb", "MO": "Mo", "TC": "Tc", "RU": "Ru", "RH": "Rh", "PD": "Pd", "AG": "Ag", "CD": "Cd", "IN": "In", "SN": "Sn", "SB": "Sb", "TE": "Te", "XE": "Xe", "CS": "Cs", "BA": "Ba", "LA": "La", "CE": "Ce", "PR": "Pr", "ND": "Nd", "PM": "Pm", "SM": "Sm", "EU": "Eu", "GD": "Gd", "TB": "Tb", "DY": "Dy", "HO": "Ho", "ER": "Er", "TM": "Tm", "YB": "Yb", "LU": "Lu", "HF": "Hf", "TA": "Ta", "RE": "Re", "OS": "Os", "IR": "Ir", "PT": "Pt", "AU": "Au", "HG": "Hg", "TL": "Tl", "PB": "Pb", "BI": "Bi", "PO": "Po", "AT": "At", "RN": "Rn", "FR": "Fr", "RA": "Ra", "AC": "Ac", "TH": "Th", "PA": "Pa", "NP": "Np", "PU": "Pu", "AM": "Am", "CM": "Cm", "BK": "Bk", "CF": "Cf", "ES": "Es", "FM": "Fm", "MD": "Md", "NO": "No", "LR": "Lr", "RF": "Rf", "DB": "Db", "SG": "Sg", "BH": "Bh", "HS": "Hs", "MT": "Mt", "DS": "Ds", "RG": "Rg", "CN": "Cn", "NH": "Nh", "FL": "Fl", "MC": "Mc", "LV": "Lv", "TS": "Ts", "OG": "Og"}
	return mapReplace(mapping, str);
}

var balance = function balance(data, api) {
    var fs = require("fs");
    var path = require("path");
    var jsdom = require("jsdom");
    var JSDOM = jsdom.JSDOM
    var htmlf = fs.readFileSync(path.join(__dirname, "obb", "ChemicalEquationBalancer", "balancer.html"), {encoding: "utf8"});

    var balancerHTML = new JSDOM(htmlf, {
	    runScripts: "dangerously"
    });
    let window = balancerHTML.window;
    let document = balancerHTML.window.document;
	let inputValue = convert(data.body.toUpperCase());
	
	
	document.getElementById("inputFormula").value = inputValue;
	document.getElementById("doBalance").click();
	
	let error = document.getElementById("message").innerHTML;
	if (error != "") {
		let errorAtHTML = document.getElementById("codeOutput").innerHTML.trim().replace(/<u>/g, " _").replace(/<\/u>/g, "_ ").trim();
		api.sendMessage(`${error}\n\n${errorAtHTML}` , data.threadID, ()=>{delete document; delete window; delete balancerHTML; delete JSDOM; delete jsdom;}, data.messageID);
		return false;
	}
	
	let resultText = "";
	let nodesList = document.getElementById("balanced").childNodes;
	for (let i in nodesList) {
		switch (nodesList[i].className) {
			case "coefficient":
			case "rightarrow":
			case "plus":
				resultText += nodesList[i].innerHTML;
				break;
			case "term":
				for (let j in nodesList[i].childNodes) {
					switch (nodesList[i].childNodes[j].tagName) {
						case "SPAN":
							switch (nodesList[i].childNodes[j].className) {
								case "element":
									resultText += nodesList[i].childNodes[j].innerHTML.replace(/<sub>(.+?)<\/sub>/g, subscript);
									break;
								case "group":
									for (let k in nodesList[i].childNodes[j].childNodes) {
										switch (nodesList[i].childNodes[j].childNodes[k].nodeType) {
											case 3:
												resultText += nodesList[i].childNodes[j].childNodes[k].wholeText;
												break;
											case 1:
												switch (nodesList[i].childNodes[j].childNodes[k].tagName) {
													case "SPAN":
														resultText += nodesList[i].childNodes[j].childNodes[k].innerHTML.replace(/<sub>(.+?)<\/sub>/g, subscript);
														break;
													case "SUB":
														resultText += subscript(null, nodesList[i].childNodes[j].childNodes[k].innerHTML);
														break;
												}
												break;
										}
									}
									break;
							}
							break;
						case "SUP":
							resultText += superscript(null, nodesList[i].childNodes[j].innerHTML);
							break;
					}
				}
				break;
		}
	}
	api.sendMessage(resultText , data.threadID, ()=>{delete document; delete window; delete balancerHTML; delete JSDOM; delete jsdom;}, data.messageID);
	return true;
}

module.exports = {
	balance,
	init
}
