app.service('TransitionModel', function(Map) {

    function TransitionModel(symbol, source, target) {
        this.id = `${symbol},${source},${target}`;
        this.symbol = symbol;
        this.source = source;
        this.target = target;
    }

    return TransitionModel;

});
