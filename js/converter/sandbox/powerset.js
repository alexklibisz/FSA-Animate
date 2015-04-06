l = [5,4,3,2,1]
ps = []

var i, iter;
var tmp_list; // holds a list for processing

/* create the list of singletons */
for (i = 0; i < l.length; i++) {
  ps.push([l[i]]);
}

/* while it is possible to construct unique combinations
   by adding to the elements of ps from the elements of
   l, do so by cloning the list we want to add to,
   adding a single element of l that is greater than all
   of its elements, and then adding the cloned list to ps.
   We do this for each element added to ps as well, until
   we reach the end of ps. */

iter = 0;   // iter is the index of the ps elem under consideration

while (iter < ps.length) {
  /* iterate through l, looking for an element of l that can be
     added to ps[iter] to form a unique combination. This is true
     if and only if the element is greater than the largest element
     of ps[iter], which is always the last elem of ps[iter] */
  for (i = 0; i < l.length; i++) {
    if (l[i] > ps[iter][ps[iter].length-1]) {
      tmp_list = ps[iter].slice(0);
      tmp_list.push(l[i]);
      ps.push(tmp_list);
    }
  }
  iter++;
}

// insert the null set for kicks
ps.unshift([]);

console.log(ps);
