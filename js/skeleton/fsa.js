/**
 * Protected variables.
 * Can be accessed by any functions in this script,
 * but can't be accessed without a getter function 
 * externally.
 */

/**
 * Constructor for FSA class instances.
 * Any public variables for an FSA instance 
 * should be declared here.
 *
 * Giving more descriptive names for the
 * formal (Q, sigma, delta, q_o, F)
 * 
 */
function FSA(states, alphabet, transitions, startState, finalStates) {
	this.states = states;
	this.alphabet = alphabet;
	this.transitions = transitions;
	this.startState = startState;
	this.finalStates = finalStates;
}

/**
 * Zero-argument constructor.
 */
function FSA() {
	this.states = [];
	this.alphabet = {};
	this.transitions = [];
	this.startState = [];
	this.finalStates = [];
}

/**
 * Class functions.
 * Available externally.
 */
FSA.prototype.print = function() {
	console.log(this);
};

/**
 * Export the class.
 */
module.exports = FSA;