class ObjectMap extends Map {
	constructor(def){
		super();
		this._def = typeof def == "function" ? def : (() => def);
	};
	get(key){
		let val = super.get(key);
		return val ?? this._def(key);
	};
};

function native(fn){
	fn.toString = () => `function ${fn.name}() { [native code] }`;
	return fn;
};
native(native);




module.exports = {
	native,
	ObjectMap,
};
