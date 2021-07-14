class HTMLElement {
    constructor(parent = null, attributes = {}, children = []){
        this.parent = parent;
        this.attributes = attributes;
        this.tag = null;
        this.children = Array.isArray(children) ? children : [];
        this.__type = "HTMLElement";
    };
    addChild(element){
    	element.parent = this;
        this.children.push(element);
    };
    setAttr(name, value){
        this.attributes[name] = value;
    };
    toTree(){
    	// todo...?
    	return this.children.map(el => el.toTree());
    };
};

class TextNode {
    constructor(parent = null, content = ""){
        this.parent = parent;
        this.content = content;
        this.__type = "TextNode";
    };
};

module.exports = {
    HTMLElement,
    TextNode,
};