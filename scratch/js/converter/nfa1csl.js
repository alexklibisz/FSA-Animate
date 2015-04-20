var FSA = require('./fsa.js');
var Set = require('./set.js');
var Converter = require('./converter.js');
var Map = require('./map.js');

/* 
   Book NFA, p.53 construction: 
*/

var states = ['1','2','3']

var sigma = ['a','b']

var delta = new Map();
delta.put('1-b', ['2']);
delta.put('1-E', ['3']);
delta.put('2-a', ['2','3']);
delta.put('2-b', ['3']);
delta.put('3-a', ['1']);

var init_state = '1';

var final_states = ['1'];  // if multiple: '1,2,3'

var nfa = new FSA(states, sigma, delta, init_state, final_states);

var converter = new Converter(nfa);
converter.print();

console.log(nfa.power_set(nfa.states));
console.log("eclosure of {1,2}:");
console.log(nfa.epsilon_closure(['1','2']));
console.log("eclosure of {1}:");
console.log(nfa.epsilon_closure(['1']));
console.log("eclosed transition set of {3} on a:");
console.log(nfa.eclosed_transitions(['3'],'a'));
console.log("eclosed transition set of {2} on a:");
console.log(nfa.eclosed_transitions(['2'],'a'));

console.log("converting NFA to DFA...");
converter.convert();

console.log("RESULTING DFA:");
converter.dfa.print();
