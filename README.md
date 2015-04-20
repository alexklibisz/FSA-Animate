#FSA-Animate - Visual NFA to DFA Converter
##[alexklibisz.github.io/FSA-Animate](alexklibisz.github.io/FSA-Animate/)

COSC312 Spring 2015 Honors by Contract Project, Alex Klibisz, Connor Minton

***Note: The source files are located in the gh-pages branch (https://github.com/alexklibisz/FSA-Animate/tree/gh-pages), as this tool is hosted as a site via GitHub pages.***

####Summary

FSA-Animate is a tool for converting [Nondeterministic finite automaton](http://en.wikipedia.org/wiki/Nondeterministic_finite_automaton) to [Deterministic finite automaton](http://en.wikipedia.org/wiki/Deterministic_finite_automaton) via an interactive, visual interface.

####Features
- Create an NFA interactively, or from a JSON input form.
- Convert the NFA to an equivalent DFA in any of three ways:
  - Step-by-step - where the addition of a transition to the DFA is one step.
  - All at once - go from NFA to DFA in one click.
  - Incrementally - at one second intervals, with the option to pause the conversion.

####Algorithm

####Implementation
- Developed entirely in Javascript, HTML, and CSS.
- Uses Angular JS for an MVC structure to sync the visualization with the conversion in the background.
- Uses the D3.js force as a basis for the NFA and DFA visualization.

