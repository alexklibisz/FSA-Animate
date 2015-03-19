/**
 * JSON representation of NFA From exam 1, question 2 (also one of the first examples in the book)\
 */
module.exports = input;

var input = {
    "alphabet": ["a", "b"],
    "states": [{
        "id": 1,
        "transitions": [{
            "symbol": "b",
            "targets": [
                [2]
            ]
        }, {
            "symbol": "E",
            "targets": [
                [3]
            ]
        }]
    }, {
        "id": 2,
        "transitions": [{
            "symbol": "a",
            "targets": [
                [2],
                [3]
            ]
        }, {
            "symbol": "b",
            "targets": [
                [3]
            ]
        }]
    }, {
        "id": 3,
        "transitions": [{
            "symbol": "a",
            "targets": [
                [1],
                [1, 3]
            ]
        }]
    }],
    "transitions": [],
    "startState": 1,
    "finalStates": [1]
};
