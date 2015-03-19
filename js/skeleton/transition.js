function transition(id, symbol, reachableStates) {
	this.id = id;
	this.symbol = symbol;
	this.reachableStates = reachableStates;
}

transition.prototype.print = function() {
	console.log('transition', this);
}

module.exports = transition;

