const fs = require("fs");

const text = fs.readFileSync("./human_chat.txt", {encoding: "utf8"});
const lines = text.split("\n");

const human1 = [];
const human2 = [];

lines.forEach((line) => {
	const reg = /^Human (?<name>\d): (?<sentence>.*?)$/;
	if(reg.exec(line) !== null){
		const {name, sentence} = reg.exec(line).groups;

		if(name === "1"){
			human1.push(sentence);
		}else if(name === "2"){
			human2.push(sentence);
		}
	}
});

fs.writeFileSync("./human1.txt", human1.join("\n"));
fs.writeFileSync("./human2.txt", human2.join("\n"));