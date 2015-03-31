app.service('StateModel', function(Map) {
    function StateModel(label, x, y) {
        this.label = label;
        //id has to be prefixed by an N to guarantee HTML validity.
        if(label[0] === 'N') this.id = label;
        else this.id = `N${label}`;
        this.x = x;
        this.y = y;
        this.selected = false;
        /**
         * Tll transitions from and to this object
         * are stored as objects in separate maps.
         * Dragging a node state will update the 
         * source property of all transitions *from*
         * this state and the target property of all 
         * transitions *to* this state. 
         */
        this.transitionsFrom = new Map();  
        this.transitionsTo = new Map(); 
    }
    return StateModel;
});
