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
        this.states = [];               /* we will use this as a convenience for iterating
                                           through all the states in the machine */
        this.alphabet = [];             /* changed from {} to []. We just need to be able to
                                           iterate through a list of possible symbols */
        this.transitions = new Map();
        this.startState = [];           /* a state ID should always be represented as
                                           a sorted array of integers. */
        this.finalStates = [];          /* In accordance with the above definition, 
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

/*
   power_set(states, inc_null)

   Computes the power set of an ARRAY of states.

   ***IMPORTANT***
   power_set() expects the input to be a set of 
   NFA states, so it just uses the first element of
   each state "array" as the label. This means that
   your labels (or IDs) should have one element. The
   multi-element IDs are reserved for the DFA.
   (e.g.: <states> = [[1],[2]]
      ==> Return value is [[],[1],[2],[1,2]] )

   Returns an array containing the power set.
   This set will contain a state without a label (a state
   with label []) if inc_null is set to true. This is
   the default behavior.
*/

FSA.prototype.power_set = function (states, inc_null) {
  var flat_states = [];
  var powerset = states.slice(0); // creates list of singletons
  var i, iter;
  var tmp_list; // holds a list for processing

  if (!states) return [];
  if (arguments.length === 1) inc_null = true;

  /* flatten the NFA array and store in flat_states */
  for (i = 0; i < states.length; i++)
    flat_states.push(states[i][0]);

  /* While it is possible to construct unique combinations
     by adding to the elements of powerset from the elements of
     flat_states, do so by cloning the list we want to add to,
     adding a single element of flat_states that is greater than
     all of the new list's elements, and then adding the cloned
     list to powerset. We do this for each element in and added
     to powerset until no more unique combinations can be added. */

  iter = 0;  // the index of the powerset elem under consideration
  while (iter < powerset.length) {
    /* iterate through flat_states, looking for an element of
       flat_states that can be added to powerset[iter] to form a
       unique combination. This is true when flat_states[i] is
       greater than the largest element of powerset[iter], which
       is always the last element of powerset[iter]. This
       guarantees that every list added to powerset is a unique
       combination, where the permutation is the one in which
       the elements are ordered least to greatest. */
    for (i = 0; i < flat_states.length; i++) {
      if (flat_states[i] > powerset[iter][powerset[iter].length-1]) {
        tmp_list = powerset[iter].slice(0);
        tmp_list.push(flat_states[i]);
        powerset.push(tmp_list);
      }
    }
    iter++;
  }

  // add the null set if requested
  if (inc_null) powerset.unshift([]);

  return powerset;
};

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
    <states> is an ARRAY of states for which one wants to compute 
    the epsilon closure. (i.e., states = [[1],[2],[3]]).
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
  eclosed_transitions(states, symb)

  <states> is an array of integers, each of which represents a single
  NFA state (e.g., 1 in <states> is [1] in the NFA). <symb> is a char
  that denotes the symbol on which the transition takes place.

  Returns an array of states similar to the input <states>. The output
  states represent the epsilon-closed set of states reachable from
  <states> on input <symb>.
*/

FSA.prototype.eclosed_transitions = function (states, symb) {
  var i, j;
  var trans_set = new Set();
  var trans_array;
  var post_eclose;
  var output_states = [];   // flattened output array

  /* we're expecting a one dimensional array of integers,
     so we need to expand it to a two dim array of singletons.
     At the same time, we'll find the set of states reachable
     from <states> on <symb> */
  for (i = 0; i < states.length; i++) {
    trans_array = this.transitions.find([[states[i]],symb]);
    for (j = 0; j < trans_array.length; j++)
      trans_set.insert(trans_array[j]);
  }

  // calculate the epsilon closure of these states
  post_eclose = this.epsilon_closure(trans_set.toArray()).toArray();

  /* the caller is expecting a one dimensional array of integers, so
     we need to flatten the array... */
  for (i = 0; i < post_eclose.length; i++) {
    output_states.push(post_eclose[i][0]);
  }

  output_states.sort(function (a,b) {return a-b});
  return output_states;
};

/**
 * Export the class.
 */
module.exports = FSA;
