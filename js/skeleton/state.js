
// could overload to avoid checking arguments length, but probably shouldn't: http://stackoverflow.com/questions/4179283/how-to-overload-constructor-of-an-object-in-js-javascript
function state(values, transitions) {    
    if (arguments.length !== 2) {
        this.values = [];
        this.transitions = [];
    } else {
        this.values = values;
        this.transitions = transitions;
    }
}

state.prototype.print = function() {
    console.log('state values: ', this.values, 'state transitions: ', this.transitions);
}

module.exports = state;
