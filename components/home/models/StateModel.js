app.service('StateModel', function(Map) {
    function StateModel(label, x, y) {
        this.label = label;
        this.id = `N${label}`;    //has to be prefixed by an N to guarantee HTML validity.
        this.x = x;
        this.y = y;
        this.selected = false;
        this.transitions = new Map();   //holds all of the transition objects for this State, keyed on id.
    }
    return StateModel;
});
