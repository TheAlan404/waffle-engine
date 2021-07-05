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

function parse(content){
	
};

module.exports = { parse, parseBlock, parseLine };
