const { native, ObjectMap } = require("../util.js");

const SessionStorageData = new ObjectMap((url) => {
	return {};
});

function createStorage(data, save){
	let Storage = new Object(null);
	Object.defineProperty(Storage, "length", {
		get: native(() => Object.keys(data).length),
		writable: false,
	});
	Storage.key = native((n) => Object.keys(data).sort()[n]);
	Storage.getItem = native((k) => data[k]);
	Storage.setItem = native((k, v) => {
		if(typeof v !== "string") throw new TypeError("Value must be a string");
		data[k] = v;
		save(data);
	});
	Storage.removeItem = native((k) => data[k] = undefined);
	Storage.clear = native(() => {
		data = {};
		save(data);
	});
};

function createSessionStorage(url){
	let data = SessionStorageData.get(url);
	return createStorage(data, (newdata) => SessionStorageData.set(url, newdata));
};

function createLocalStorage(){
	return createStorage({}, () => {}); // No saving for now.
};
