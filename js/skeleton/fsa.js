/**
 * Dependencies
 */
var Map = require('./map.js');

/**
 * Protected variables.
 * Can be accessed by any functions in this script,
 * but can't be accessed without a getter function 
 * externally.
 *
 * Don't use this for now as it turns things into 
 * singletons that we don't necessarily want to be
 * singletons.
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
    if (arguments.length !== 5) {
        this.states = new Map();
        this.alphabet = {};
        this.transitions = [];
        this.startState = [];
        this.finalStates = [];
    } else {
    	this.states = states;
	    this.alphabet = alphabet;
	    this.transitions = transitions;
	    this.startState = startState;
	    this.finalStates = finalStates;
    }
}

/**
 * Class functions.
 * Available externally.
 */

/**
 * This does a deep print of the entire object and its properties.
 */
FSA.prototype.print = function() {
    console.log('states: ', JSON.stringify(this.states));
    console.log('alphabet: ', JSON.stringify(this.alphabet));
    console.log('transitions: ', JSON.stringify(this.transitions));
    console.log('startState: ', JSON.stringify(this.startState));
    console.log('finalStates: ', JSON.stringify(this.finalStates));
};

/**
 * Export the class.
 */
module.exports = function() {
    return new FSA();
}
