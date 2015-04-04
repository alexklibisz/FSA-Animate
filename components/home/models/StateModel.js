app.service('StateModel', function(Map) {
    function StateModel(label, x, y) {
        //id is prefixed by an N
        if(label[0] === 'N') this.id = label;
        else this.id = `N${label}`;
        this.label = label;
        this.x = x;
        this.y = y;
        this.selected = false;
    }
    return StateModel;
});
