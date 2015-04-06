var Map = require("./map.js");
var Set = require("./set.js");
var FSA = require("./fsa.js");

var delta = new Map();
delta.put([[1],'a'],[[1],[2]]);     // delta(1,a)       = {1,2}
delta.put([[1],'b'],[[2]]);         // delta(1,b)       = {2}
delta.put([[1],'E'],[[3]]);         // delta(1,epsilon) = {3}
delta.put([[2],'a'],[[1]]);         // delta(2,a)       = {1}
delta.put([[2],'b'],[[3]]);         // delta(2,b)       = {3}
delta.put([[2],'E'],[]);            // delta(2,epsilon) = {}
delta.put([[3],'a'],[[2]]);         // delta(3,a)       = {2}
delta.put([[3],'b'],[]);            // delta(3,b)       = {}
delta.put([[3],'E'],[[1]]);         // delta(3,epsilon) = {1}

var fstates = new Set([[3]]);

var machine =
  new FSA([[1],[2],[3]],
          ['a','b'],
          delta,
          [1],
          fstates);

machine.print();

console.log("epsilon closure of {}: ", machine.epsilon_closure([]));
console.log("epsilon closure of {1}: ", machine.epsilon_closure([[1]]));
console.log("epsilon closure of {2}: ", machine.epsilon_closure([[2]]));
console.log("epsilon closure of {3}: ", machine.epsilon_closure([[3]]));
console.log("epsilon closure of {1,2}: ", machine.epsilon_closure([[1],[2]]));
console.log("epsilon closure of {1,3}: ", machine.epsilon_closure([[1],[3]]));
console.log("epsilon closure of {2,3}: ", machine.epsilon_closure([[2],[3]]));
console.log("epsilon closure of {1,2,3}: ", machine.epsilon_closure([[1],[2],[3]]));
