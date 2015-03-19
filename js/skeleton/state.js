function state(id, values, transitions) {
	this.id = id;
	this.values = values;
	transitions = transitions;
}

state.prototype.print = function() {
	console.log('state', this);
}

module.exports = state;