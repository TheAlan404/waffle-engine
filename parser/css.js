const { removeMultilineComments } = require("./util.js");
const warn = console.warn;

/*
! Todo !

- Custom Error Classes
- Typechecking for CSSValue's
- CSS Comments
- at-rules (@import etc)
*/

function parseLine(line){
	if(!line.endsWith(";")) throw new Error("CSSLine: Line must end with a semicolon (';')");
	if(!line.includes(":")) throw new Error("CSSLine: Line does not have a colon (':')");
	line = line.replace(/;/g, "");
	let [property, value] = line.split(":");
	return [property.trim(), value.trim()];
};

function parseBlock(lines){
	let block = {};
	for(let line of lines) {
		try {
			let [property, value] = parseLine(line);
			if(block[property]) warn("CSSBlock: Property overwritten: "+property);
			block[property] = value;
		} catch(e) {
			warn(e);
			continue;
		};
	};
	return block;
};

function parseSelections(content){
	return [content]; // TODO
};

/**
* @typedef {object[]} CSSData
* @prop {string[]} selection - ex: "h1"
* @prop {object} block - ex: { color: "red" }
*/

/**
* Parse CSS
* @param {string} content
* @returns {CSSData}
*/
function parse(content){
	let data = [];
	content = removeMultilineComments(content);
	content = content.replace(/\n/g, ""); // ::Would this break it?
	let current = "selections"; // ('selections'|'block')
	let selection = null;
	let buf = "";
	for(let char of content) {
		switch(char){
			case "{":
				// Parse the selections and begin saving the block
				selection = parseSelections(buf.trim());
				buf = "";
				current = "block";
				break;
			case "}":
				// End the block and parse it
				data.push({
					selection,
					block: parseBlock(buf.trim()),
				});
				selection = null;
				current = "selections";
				buf = "";
				break;
			default:
				buf += char;
		};
	};
	return data;
};

module.exports = { parse, parseBlock, parseLine };
