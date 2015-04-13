var Map = require('./map.js');
var Set = require('./set.js');

var map = new Map();

map.put([1,'a'], [1,2]);
map.put([1,'b'], [2]);
map.put([1,'E'], [3]);

map.put([2,'a'], [1]);
map.put([2,'b'], [3]);
map.put([2,'E'], []);

map.put([3,'a'], [2]);
map.put([3,'b'], []);
map.put([3,'E'], [1]);

var id = 1;
var symb = 'a';
var transition = map.find([id,symb]);
if (transition === false) {
  console.log("Could not find transition from "+id+" on symbol "+symb+".");
}
else {
  console.log("Transition from "+id+" on symbol "+symb+" goes to: ");
  console.log(transition);
}

console.log("Goes to "+transition.length+" states.");

var set = new Set();

if (set.insert([1,2]))
  console.log("insert successful");
if (set.insert([3,4]))
  console.log("insert successful");
if (set.insert([1,5]))
  console.log("insert successful");

var vals = set.values();
console.log(vals);

var set2 = new Set();

set2.insert([3,4]);
set2.insert([1,2]);
set2.insert([5,2]);

console.log(set2.values());

if (set.equals(set2))
  console.log("sets are equal");
else console.log("sets are not equal");

var set3 = new Set([1,2,3]);
var set4 = new Set([3,2,1]);

if (set3.equals(set4))
  console.log("sets 3 and 4 are equal");
else console.log("sets 3 and 4 are not equal");

console.log(set2.values());
set2.insert([5,2]);
console.log(set2.values());
set2.insert([1,3]);
console.log(set2.values());
set2.remove([5,2]);
console.log(set2.values());
set2.remove([1,3]);
console.log(set2.values());
