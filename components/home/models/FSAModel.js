app.service('FSAModel', function(Map, StateModel, TransitionModel) {

    function FSAModel(container, height, width, states, transitions, alphabet, startState, acceptStates) {
        
    }

    FSAModel.prototype = {
        /**
         * Validate the passed state by its id,
         * Create a new state object from the label, x, and y
         * Add the state object to the states map
         * Return the new state object
         */
        addState: function(id, x, y) {
            alert("add state");
        },
        /**
         * 
         */
        appendState: function(state) {
            alert("append state");
        },
        /**
         * Add the class selected to state
         */
        selectState: function(state) {
            alert("select state");
        },
        /**
         * Call deleteState for all selected states
         */
        deleteSelectedStates: function() {
            alert("delete selected states");
        },
        /**
         * Delete the passed state and all associated links.
         */
        deleteState: function(state) {

        },
        /**
         * Possibly begin a "new nfa" with a default start state.
         */
        setStartState: function() {},
        /**
         * Mark all selected states as accept states.
         */
        setAcceptStates: function() {

        },
        /**
         * create a new transition object from the source state, target state
         * and symbols.
         */
        appendTransition: function(sourceState, targetState, symbols) {

        },
        /**
         * 
         */
        drawTransition: function(transition) {

        },
        /**
         * 
         */
        deleteTransition: function(transition) {

        },
        /**
         * append any necessary svg defs.
         */
        appendDefs: function() {

        },
        /**
         * Generic function for toggling a true/false property
         * for a state, its css class, and in its object.
         */
        toggleStateProperty: function(state, property) {

        }
    }

    return FSAModel;

});
