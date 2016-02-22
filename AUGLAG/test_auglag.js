var auglag = require('./auglag.js');

//augmented lagrange objective function
//sum(x[i]*c[i]) + sum(max(0.5*lambda_i + p_i*g(x)_i, 0))^2
function objective(x, constants, target, constraints, penalties, multipliers){
	var out = 0;
	for (var i=0; i<constants.length; i++){
		 out += constants[i]*x[i];
	}
	var final = out-target;
	var constr_ = 0;
	for (var j=0; j<constraints.length; j++){
		constr_ += Math.max( 0.5*multipliers[j]+penalties[j]*constraints[j](x), 0)
	}
	constr_ = Math.pow(constr_, 2);

	final += constr_;
	return final;
}

//define each constraint on x as a function of x
var constraints = [
	function(x){
		return (2*x[0] + 3*x[1] - 10);
	}
];


function test_auglag(){
	var constants = [2.3, 4.5, 1.2, 4];
	var x_init = [0, 0, 0, 0];
	var target = 1000;

	var obj = auglag.auglag
	var results = obj.begin_(objective, x_init, constants, target, constraints);
	console.log(results, 'qiwhdgd');


}



test_auglag();



