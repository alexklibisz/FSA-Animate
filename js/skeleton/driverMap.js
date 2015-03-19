/**
 * Some examples of the map object we can use.
 */

var Map = require('./genericMap.js');

var m = new Map();

// //some basic string, integer pairs
m.put("one", 1);
console.log(m.find("one"));       //prints '1'
m.remove("one");
console.log(m.find("one"));       //prints false

// //it can take lists
m.put("digits", [0,1,2,3,4,5,6,7,8,9]);
console.log(m.find("digits"));
console.log("-----");

// //it can take objects
m.put("Alex", { name: 'Alex Klibisz', major: 'CS'});
console.log(m.find("Alex"));
console.log("-----");

// //it can take other maps
var m2 = new Map();
m2.put(1, 'one');
m.put('m2', m2);
console.log(m2.contents);
console.log("-----");

//it accepts bad practice
m.put([0,1,2], "why would you do that");
console.log(m.find([0, 1, 2]));
console.log("-----");

//you can clear the whole thing
console.log(m.contents);
m.clear();
console.log("-----");
console.log(m.contents);
console.log(m2.contents);
