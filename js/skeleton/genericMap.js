/**
 * This is a fairly naiive implementation of a map
 * using a regular javascript object. I usually set
 * something like this up in my javascript projects,
 * mainly for the convenience and clarity of calling
 * something a map.
 */

// var contents;

function genericMap() {
	this.contents = {};
}

genericMap.prototype.put = function(key, value) {
	this.contents[key] = value;
}

genericMap.prototype.find = function(key) {
	if(this.contents.hasOwnProperty(key)) {
		return this.contents[key];
	} else {
		return false;
	}
}

genericMap.prototype.remove = function(key) {
	var value = this.find(key);
	if(value != false) {
		delete this.contents[key];
	}
}

module.exports = genericMap;