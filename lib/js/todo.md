- implement the case where an existing link needs to be combined with a new link.
- make all self-loops angle towards the closest corner.
- give an option to select and delete just links.


- make an attribute in the link object called style, set it to "curved" by default, add an argument to addLink() to set the style. If the style is set to "straight", ignore the arc in the linkArc function and just return a point-to-point straight "arc".

- do the same for arc length.
