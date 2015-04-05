var Map = require("./map.js");
var Set = require("./set.js");
var FSA = require("./fsa.js");

var delta = new Map();
delta.put([[1],'a'],[[1],[2]]);
delta.put([[1],'b'],[[2]]);
delta.put([[1],'E'],[[3]]);
delta.put([[2],'a'],[[1]]);
delta.put([[2],'b'],[[3]]);
delta.put([[2],'E'],[]);
delta.put([[3],'a'],[[2]]);
delta.put([[3],'b'],[]);
delta.put([[3],'E'],[[1]]);

var fstates = new Set([[3]]);

var machine =
  new FSA([[1],[2],[3]],
          ['a','b'],
          delta,
          [1],
          fstates);

machine.print();
