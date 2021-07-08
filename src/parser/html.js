const { removeHTMLComments } = require("./util.js");
const { HTMLElement, TextNode } = require("./html/Element.js");

function parse(content){
	content = removeHTMLComments(content);
	let state = "text"; // (text|tagblank|tagname|tagattrname|tagattrvalue)
	let root = new HTMLElement();
	let current = root;
	let buf = "";
	for(let char of content){
		switch(char){
			case "<":
				if(state !== "text") throw new Error("HTMLParser: Illegal State on '<' eccounter");
				if(buf.trim().length) current.children.push(new TextNode(buf.trim()));
				buf = "";
				state = "tagname";
				break;
			case " ":
				if(state === "tagname") {
					if(!buf.length) break; // EX: < body >hi</body >
				};
		};
	};
};
// i gibe up

//
