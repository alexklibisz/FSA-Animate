/**
 * Dependencies
 */
var Map = require('./map.js');
var Set = require('./set.js');

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
      console.log("construction failure. args:", arguments.length);
        this.states = [];               /* we will use this as a convenience for iterating
                                           through all the states in the machine */
        this.alphabet = [];             /* changed from {} to []. We just need to be able to
                                           iterate through a list of possible symbols */
        this.transitions = new Map();
        this.startState = [];           /* a state ID should always be represented as
                                           a sorted array of integers. */
        this.finalStates = new Set();   /* In accordance with the above definition, 
                                           the set of finalStates should always be
                                           a Set of sorted arrays of integers */
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
  epsilon_closure(states)
    <states> is a list of states one wants to compute the epsilon closure
    for. (i.e., states === [[1],[2],[3]]).
*/
FSA.prototype.epsilon_closure = function(states) {
  if (!(states instanceof Array)) {
    console.err("epsilon_closure called without an Array argument.");
    return false;
  }

  var eclosed_states = new Set(states);
  var queue = new Set(states);
  var delta = this.transitions;

  while (queue.size() !== 0) {
    /* add all states reachable on an epsilon transition to the queue
       and the list of eclosed states */
    var src = queue.data.shift();
    var dst = delta.find([src, 'E']);

    for (var i = 0; i < dst.length; i++) {
      if (eclosed_states.insert(dst[i]))
        queue.insert(dst[i]);
    }
  }

  return eclosed_states;
};

/**
 * Export the class.
 */
module.exports = FSA;
