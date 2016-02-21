var globals = {
	copy: function(x){
		result = [];
		for (var i=0; i<x.length; i++){
			result.push(x[i]);
		}
		return result;
	}
}


//partial derivative of f wrt x (indicated by the index)
function deriv(f, x, constants, target, i){
	var h = 0.0001;
	var f_x = f(x, constants, target);
	var copy_ = globals.copy(x);
	copy_[i] = copy_[i]+h;
	return (f(copy_, constants, target) - f_x)/h;
}


var gradient_following = {
	sign_check: function(s, t){
		//max(s, 0) indicates the value that is greater
		var max_s = Math.max(s, 0);
		var max_t = Math.max(t, 0);

		//if max_s is 0 and max_t is non zero, then sign changed.
		//if max_t is 0 and max_s is non zero, then sign changed.
		if(max_s == 0 && max_t > 0 || max_t == 0 && max_s > 0){
			return true;
		}
		else{
			return false;
		}
	},
	
	test_estimation: function(func, x, constants, target){
		res = [];
		sum_cons = 0;

		var f_x = func(x, constants, target);
		var gradients = [];

		for (var j=0; j<x.length; j++){
			gradients.push(deriv(func, x, constants, target, j));
		}

		for(var i=0; i<x.length; i++){
			sum_cons += constants[i];
		}
		for(var i=0; i<x.length; i++){
			var gradient_sign = gradients[i]/Math.abs(gradients[i]);
			res.push(  gradient_sign + /*constants[i] +*/ target );
		}

		return res;
	},

	begin_estimation: function (func, x, constants, target){
		var repetition_check = {};
		var run = true;
		var cond = 0.0001;
		var max_iters = 1000;
		var n_ = 0;

		while (run){
			var f_x = func(x, constants, target);
			var gradients = [];

			for (var j=0; j<x.length; j++){
				gradients.push(deriv(func, x, constants, target, j));
			}

			delta = 0-f_x;


			if (target <= 9e4){
				var booster = 1;
			}
			else{
				var booster = target/Math.min(10000, target);
			}

			for (var g=0; g<x.length; g++){
				var gradient_sign = gradients[g]/Math.abs(gradients[g]) * booster;
				x[g] = x[g] + (gradient_sign * Math.log(Math.abs(delta/gradients[g])));
			}
			
			var fx_2 = func(x, constants, target);
			console.log(fx_2, target, 'estimating..');
			
			var key = Math.round(f_x, 2)+Math.round(fx_2, 2);	
			if (key in repetition_check){
				repetition_check[key] += 1
			}
			else{
				repetition_check[key] = 1
			}

			n_ += 1;

			//incrementing the n_iters if the thing is moving closer to the target
			if (Math.abs(0-fx_2) < Math.abs(0-f_x)){
				max_iters += 1;
			}

			if (Math.abs( fx_2 - f_x) <= cond || this.sign_check(fx_2, f_x) || repetition_check[key] >= 3){
				run = false;
			}

			//set a cap on max iterations
			if (n_  >= max_iters){
				x = null;
				run = false;
			}
		}
		return x;
	}
}


var DNM =  {
	get_init_sign: function (func, x, constancts, target, gradients){
		var sign_directions = [-1, 1];
		var results = [];
		var f_x = func(x, constants, target);
		var fdx = func(gradients, constants, target);
		for (var j=0; j<sign_directions.length; j++){
			for (var k=0; k<x.length; k++){
				x[k] = x[k] - (sign_directions[j]*( f_x/fdx ));	
			}
			results.push(Math.abs(func(x, constants, target)));
		}
		var sign_direction = sign_directions[results.indexOf(Math.min.apply(Math, results))];
		return sign_direction;
	},

	begin_: function (func, x_init, constants, target){
		//x = gradient_following.test_estimation(func, x_init, constants, target);
		x = gradient_following.begin_estimation(func, x_init, constants, target);
		console.log(x);

		if (!x){
			console.log('not solvable..');
			return x_init;
		}

		var epsilon = 0.0001;
		var run_newton = true;
		var fx_old = null;
		var old_gradients = null;
		var n = 1;
		var start_time = new Date().getTime();
		while (run_newton){
			var f_x = func(x, constants, target);
			var gradients = [];

			for (var j=0; j<x.length; j++){
				gradients.push(deriv(func, x, constants, target, j));
			}

			var fdx = func(gradients, constants, target);

			if (fx_old && old_gradients){
				var sign_direction = Math.abs(f_x + fx_old)/Math.abs(f_x + fx_old);
			}
			else{
				var sign_direction = this.get_init_sign(func, x, constants, target, gradients);
			}

			if (target <= 9e4){
				var booster = 1;
			}
			else{
				var booster = target/10000;
			}

			for (var k=0; k<x.length; k++){
				x[k] = x[k] - Math.abs(sign_direction * ( f_x/fdx )) * booster;
			}

			var f_x_2 = func(x, constants, target);

			console.log(func(x, constants, target),  (sign_direction*( f_x/fdx )), '@@@', target, booster, n);

			if (Math.abs(f_x_2) <= epsilon || Math.abs(f_x_2) < 0.01/Math.log(target) ){
				run_newton = false;
			}

			fx_old = f_x;
			old_gradients = gradients;
			n += 1;
			if ((new Date().getTime() - start_time)/1000 >= 30 ){
				x = x_init;
				run_newton = false;
			}

		}
		return x;
	}

}


if (module){
	module.exports = {
		DNM: DNM
	};
}


