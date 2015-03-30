app.service('TransitionModel', function(Map) {

    function TransitionModel(symbol, source, target) {
        this.id = `${symbol},${source},${target}`;
        this.symbol = symbol;
        if(source[0] === 'N') this.source = source;
        else this.source = 'N' + source;
        if(target[0] === 'N') this.target = target;
        else this.target = 'N' + target;
    }

    return TransitionModel;

});
