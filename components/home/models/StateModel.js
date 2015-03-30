app.service('StateModel', function(Map) {

    function StateModel(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.visible = true;
        this.transitions = [];
    }

    return StateModel;

});
