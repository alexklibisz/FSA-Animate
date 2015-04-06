var FSA = require("./fsa.js");
var Set = require("./set.js");
var Converter = require("./converter.js");
var Map = require("./map.js");

var states = [[1],[2],[3]];

var delta = new Map();
delta.put([[1],'a'], [[2]]);
delta.put([[1],'b'], []);
delta.put([[1],'E'], []);
delta.put([[2],'a'], []);
delta.put([[2],'b'], [[3]]);
delta.put([[2],'E'], []);
delta.put([[3],'a'], []);
delta.put([[3],'b'], []);
delta.put([[3],'E'], [[1]]);

var init_state = [1];
var final_states = [[1],[3]];

var nfa = new FSA(states,['a','b'],delta,init_state,final_states);

var converter = new Converter(nfa);
converter.print();

console.log("epsilon closure of {3}:", converter.nfa.epsilon_closure([[3]]));

console.log("power set of NFA states:");
console.log(nfa.power_set(nfa.states));

console.log("converting...");
converter.convert();
console.log("newly converted DFA: ");
converter.dfa.print();
