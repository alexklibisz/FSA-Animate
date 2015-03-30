app.service('StateModel', function(Map) {

    function StateModel(label, x, y) {
        this.id = `N${label}`;    //has to be prefixed by an N to guarantee HTML validity.
        this.label = label;
        this.x = x;
        this.y = y;
        this.visible = false;
        this.selected = false;
        this.transitions = [];
    }

    return StateModel;

});
