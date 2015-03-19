/**
 * This is a fairly naiive implementation of a map
 * using a regular javascript object. I usually set
 * something like this up in my javascript projects,
 * mainly for the convenience and clarity of calling
 * something a map.
 */

var contents;

function genericMap() {
	contents = {};
}

genericMap.prototype.put = function(key, value) {
	contents[key] = value;
}

genericMap.prototype.find = function(key) {
	if(contents.hasOwnProperty(key)) {
		return contents[key];
	} else {
		return false;
	}
}

genericMap.prototype.remove = function(key) {
	var value = this.find(key);
	if(value != false) {
		delete contents[key];
	}
}

genericMap.prototype.getContents = function() {
	return contents;
}

genericMap.prototype.clear = function() {
	delete contents;
}

module.exports = genericMap;