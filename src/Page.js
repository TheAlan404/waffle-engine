const { ObjectMap } = require("./util.js");
const { createLocalStorage, createSessionStorage, Storage } = require("./api/storage.js");

class Page {
	constructor(url){
		this.url = url ?? "about:blank";
		this.cookies = new Map();
		this.localStorage = new ObjectMap(createLocalStorage);
		this.sessionStorage = new ObjectMap(createSessionStorage);
		// web sql (window.openDatabase) and indexedDB are basically SQL so unimplemented for now

		this.window = null; // Window object for in-page javascript

	};
};
