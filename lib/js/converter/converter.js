/**
 * Class constructor.
 */
function Converter(nfa) {
  this.nfa = nfa;
  this.dfa = undefined;
}


/**
 * Class Functions
 */

/**
 * Generic print function for debugging purposes.
 */
Converter.prototype.print = function() {
	console.log('nfa: ', JSON.stringify(this.nfa));
	console.log('dfa: ', JSON.stringify(this.dfa));
}

/**
 * Completes the entire NFA to DFA conversion
 */
Converter.prototype.convert = function() {
  /* ALGORITHM: convert()

     define dfa to be the fsa such that
       dfa.states = power set of nfa.states
       dfa.alphabet = nfa.alphabet
       dfa.transitions = empty
       dfa.startState = epsilon_closure(nfa.startState)
       dfa.finalStates = any state in dfa.states whose label contains an element
                         of nfa.finalStates
     set dfa.transitions[[],x] := [[]], for each symbol x

     for each state S in (dfa.states - []):
       for each symbol sym in dfa.alphabet:
         set the transitions function on sym to the list
           of the epsilon_closures of all the states S
           can go to on sym
  */

  var i, j;
  var tmp_array = [];

  var states = this.nfa.power_set(this.nfa.states);
  var sigma = this.nfa.alphabet;
  var delta = new Map();  // undefined transition function
  var initState = this.nfa.epsilon_closure([this.nfa.startState]).toArray();
  var finalStates = [];   // undefined

  // flatten initState array
  initState = initState.join(',');

  // define delta's 'null', or 'error', state: loop back on all symbols
  for (i = 0; i < sigma.length; i++) {
    delta.put('?-'+sigma[i], '?');
  }

  // compute finalStates
  for (i = 0; i < states.length; i++) {
    for (j = 0; j < this.nfa.finalStates.length; j++) {
      tmp_array = states[i].split(',');
      if (tmp_array.indexOf(this.nfa.finalStates[j]) >= 0) {
        finalStates.push(states[i]);
        break;
      }
    }
  }

  /* begin looping through the states in the DFA to add transitions */
  for (i = 1; i < states.length; i++) {
    for (j = 0; j < sigma.length; j++) {
      tmp_array = this.nfa.eclosed_transitions(states[i],sigma[j]);
      console.log("eclosed_transitions = ", tmp_array);
      if (tmp_array.length === 0) {
        delta.put(states[i]+'-'+sigma[j], '?');
        console.log("adding transition: "+states[i]+'-'+sigma[j]+" --> ?");
        continue;
      }
      delta.put(states[i]+'-'+sigma[j], tmp_array.sort().join(','));
      console.log("adding transition: "+states[i]+'-'+sigma[j]+' --> '+tmp_array.sort().join(','));
    }
  }

  this.dfa = new FSA(states, sigma, delta, initState, finalStates);
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
Converter.prototype.step = function(n) {
	if(arguments.length === 0) {
		n = 1;
	}
}

/**
 * One step forward in the conversion.
 */
Converter.prototype.stepForward = function() {

}
/**
 * One step backward in the conversion.
 */
Converter.prototype.stepBackward = function() {

}