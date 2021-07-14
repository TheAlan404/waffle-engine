const { removeHTMLComments } = require("./util.js");
const { HTMLElement, TextNode } = require("./html/Elements.js");

// TODO: handle <element />

function parse(content){
	content = removeHTMLComments(content);
	let state = "text"; // (text|tagblank|tagname|tagattrname|tagattrvalue)
	/*
	====== STATES =====
	
	## text ##
	normal text.
	
	## tagblank ##
	inside a tag, waiting for either > or an attr name
	
	## tagname ##
	waiting for tag name 
	
	## tagattrname ##
	reading the tags attribute name, reads until space or =
	
	## tagattrvaluestart ##
	waits until a quote/"
	
	## tagattrvalue ##
	saves until another quote
	
	*/
	let root = new HTMLElement();
	let current = root;
	let isClosingTag = false;
	let gen = null;
	let buf = "";
	let attrName = "";
	let attrValQ = ""; // ' or "
	for(let char of content){
		console.log(`[!] '${char}' state=${state} buf=${buf} `);
		switch(char){
			case "<":
				if(state !== "text") throw new Error("HTMLParser: Illegal State on '<' eccounter");
				if(buf.trim().length) current.addChild(new TextNode(current, buf.trim()));
				buf = "";
				state = "tagname";
				gen = new HTMLElement(current, {}, []);
				break;
			case ">":
                if(state === "tagattrname") {
				    console.log("This tag has an attribute that doesnt contain any value (tagEnd)");
				    gen.setAttr(buf.trim(), null);
				    state = "tagblank"
				};
				if(state === "tagname" || state === "tagblank") {
					if(isClosingTag){
						current.addChild(gen);
						current = current.parent;
					} else {
						current.addChild(gen);
						current = gen;
					};
					gen = new HTMLElement();
					buf = "";
					isClosingTag = false;
					state = "text";
					break;
				};
			case "/":
			    if(state == "tagname" || state == "tagblank"){
			        if(buf.trim().length) console.warn("ERROR! '/' was seen after some chars, example: '<b/ody>'");
			        isClosingTag = true;
			        break;
			    };
			case "=":
			    if(state === "text") {
			        buf += char;
			        break;
			    };
			    if(state === "tagattrname") {
			        attrName = buf.trim();
			        state = "tagattrvaluestart";
			        break;
			    };
			case " ":
			    if(state === "text"){
			        buf += char;
			        break;
			    };
				if(state === "tagname") {
					if(!buf.trim().length) break; // EX: < body >hi</body >
					gen.tag = buf.trim();
					buf = "";
					state = "tagblank";
					break;
				};
				if(state === "tagblank") break;
				if(state === "tagattrname") {
				    console.log("This tag has an attribute that doesnt contain any value");
				    gen.setAttr(buf.trim(), null);
				    state = "tagblank";
				    break;
				};
			case "'":
			case '"':
			    if(state === "tagattrvaluestart") {
			        state = "tagattrvalue";
			        attrValQ = char;
			        break;
			    };
			    if(state === "tagattrvalue") {
			        if(attrValQ !== char) {
			            buf += char;
			            break;
			        };
			        gen.setAttr(attrName, buf.trim());
			        buf = "";
			        attrName = "";
			        attrValQ = "";
			        state = "tagblank";
			        break;
			    };
			default:
			    // On normal letter/number/char eccounter
			    if(state === "tagattrvaluestart") {
			        console.warn("State was Tag attribute value start, which wants for a quote/string." +
			        "Instead, somehow got a character. This can be done with somethig like '<body class=Bruh>'");
			        break;
			    };
			    if(state === "text") {
			        buf += char;
			    };
			    if(state === "tagname") {
			        buf += char;
			    };
			    if(state === "tagblank") {
			        state = "tagattrname";
			        buf = char;
			    };
			    if(state === "tagattrname") {
			        buf += char;
			    };
			    if(state === "tagattrvalue") {
			        buf += char;
			    };
		};
	};
	return root;
};

/*
<tagName attr1="yes">hewo</tagName>
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
*/

module.exports = { parse };

//
