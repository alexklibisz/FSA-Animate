/**
 * Protected variables
 */

/**
 * Class constructor.
 */
function converter(nfa, dfa) {
	this.nfa = nfa;
	this.dfa = dfa;  
}


/**
 * Class Functions
 */

/**
 * Generic print function for debugging purposes.
 */
converter.prototype.print = function() {
	console.log('nfa: ', JSON.stringify(this.nfa));
	console.log('dfa: ', JSON.stringify(this.dfa));
}

/**
 * Completes the entire NFA to DFA conversion
 */
converter.prototype.convert = function() {
  /* ALGORITHM: convert()

     define dfa to be the fsa such that
       dfa.states = power set of nfa.states
       dfa.alphabet = nfa.alphabet
       dfa.transitions = empty
       dfa.startState = epsilon_closure(nfa.startState)
       dfa.finalStates = power set of nfa.finalStates
     set dfa.transitions[[],x] := [], for each symbol x

     for each state S in (dfa.states - []):
       for each symbol sym in dfa.alphabet:
         set the transitions function on sym to the list
           of the epsilon_closures of all the states S
           can go to on sym
  */
}

/**
 * Performs *n* conversion steps.
 * if n > 0, calls stepForward() *n* times.
 * if n < 0, calls stepBackward() *n* times.
 *
 * this should somehow indicate which states were updated
 * so that I can add the appropriate new nodes and arrows
 * on the front-end. The goal is to avoid completely re-drawing
 * the DFA on every iteration. That would work, but 
 * would become slow for larger NFA/DFAs - AK
 */
converter.prototype.step = function(n) {
	if(arguments.length === 0) {
		n = 1;
	}
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
