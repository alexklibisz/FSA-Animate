var FSA = require('./fsa.js');
var Converter = require('./converter.js');
var State = require('./state.js');
var Transition = require('./transition.js');
var Map = require('./genericMap.js');

//Exam 1, Question 2

//initiailze the NFA
// var nfa = new FSA();
// nfa.print();           //everything is undefined -- that's ok

// //construct the NFA's states
// //state A
// nfa.states.push(new State(0, ['1'], []));

// nfa.print();


// var c = new converter(new FSA(1, 2), new FSA(3, 4));

// c.print();

var m = new Map();

m.put(1, 2);
console.log(m.find(1));
console.log(m.find(3));
m.remove(1);
