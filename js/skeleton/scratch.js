states = [{
    id: 1,
    transitions: [{
    	symbol: 'b',
    	targets: [[2]]
    }, {
    	symbol: 'E',
    	targets: [[3]]
    }]
}, {
	id: 2,
	transitions: [{
		symbol: 'a',
		targets: [[2], [3]]
	}, {
		symbol: 'b',
		targets: [[3]]
	}]
}, {
	id: 3,
	transitions: [{
		symbol: 'a',
		targets: [[1], [1,3]]
	}]
}];