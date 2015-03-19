var FSA = require('./fsa.js');
var Converter = require('./converter.js');
var State = require('./state.js');
var Transition = require('./transition.js');
var Map = require('./map.js');

var InputExample = require('./input/example-01.js');  //you could take this as a command line argument that specifies the file name.

//Constructing the NFA in Exam 1, Question 2 as an example

//initiailze the NFA
var nfa = new FSA(), dfa = new FSA(), state;
var converter = new Converter(nfa, dfa);

nfa.alphabet = ['a', 'b'];
nfa.transitions = [];

/**
 * A note about transitions: There's two ways we can implement this. 
 * 1) Have each state hold a list of its transitions.
 * 2) Have a map of transitions separate from the states.
 *
 * Which one we choose is whatever is preferable to you. I implemented it as the first option
 * below, but I'm starting to think keeping a map of transitions separate from the states, keyed on
 * the states' values might be preferable. - AK
 */

//initialize the states
nfa.states.put([1], new State([1], []));		//state 1, contains the values [1]
nfa.states.put([2], new State([2], []));		//state 2, contains the values [2]
nfa.states.put([3], new State([3], []));		//state 3, contains the values [3]

//initialize the transitions
//the next line behaves as a reference variable. So if you change it, it will be reflected in the nfa object.
state = nfa.states.find([1]);
state.transitions.push(new Transition(0, 'b', [[2]]));       // 1 -b-> 2
state.transitions.push(new Transition(1, 'E', [[3]]));       // 1 -E-> 3

state = nfa.states.find([2]);
state.transitions.push(new Transition(0, 'a', [[2], [3]]));  //2 -a-> 2, 2 -a-> 3 
state.transitions.push(new Transition(1, 'b', [[3]]));       //2 -b-> 3

state = nfa.states.find([3]);
state.transitions.push(new Transition(0, 'a', [[1,3]]));     //3 -a,E-> {1,3}

//specify the start and final states
nfa.startState = nfa.states.find([1]);
nfa.finalStates = [nfa.states.find([1])];

//This isn't very readable. You'll have to be familiar with JS object/list notation - AK
console.log("NFA:");
nfa.print();

//Now you do your magic
converter.step();
converter.step();
//...
converter.convert()

//And we're done
console.log("DFA:");
dfa.print();