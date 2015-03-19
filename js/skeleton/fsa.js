/**
 * Protected variables.
 * Can be accessed by any functions in this script,
 * but can't be accessed without a getter function 
 * externally.
 */
var testvar;


/**
 * Constructor for FSA class instances.
 * Any public variables for an FSA instance 
 * should be declared here.
 */
function FSA(a, b) {
	this.a = a;
	this.b = b;
	testvar = "testvariable";
}


FSA.prototype.test = function() {
	console.log(testvar);
};

module.exports = FSA;