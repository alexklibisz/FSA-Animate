/**
 * Protected variables
 */

/**
 * Class constructor.
 */
function converter(dfa, nfa) {
	this.dfa = dfa;	
	this.nfa = nfa;
}


/*******************
 * Class functions.
 *******************/

/**
 * Generic print function for debugging purposes.
 */
converter.prototype.print = function() {
	console.log('fsa', this);
}

/**
 * Completes the entire NFA to DFA conversion
 */
converter.prototype.convert = function() {

}

/**
 * Performs *n* conversion steps.
 * if n > 0, calls stepForward() *n* times.
 * if n < 0, calls stepBackward() *n* times.
 */
converter.prototype.step = function(n) {

}

/**
 * One step forward in the conversion.
 */
converter.prototype.stepForward = function() {

}
/**
 * One step backward in the conversion.
 */
converter.prototype.stepBackward = function() {

}

/**
 * Export the class.
 */
module.exports = converter;