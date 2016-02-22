var globals = {
	
	copy: function(x){
		result = [];
		for (var i=0; i<x.length; i++){
			result.push(x[i]);
		}
		return result;
	},

	norm: function(v){
		result = 0;
		for (var i=0; i<v.length; i++){
			result += Math.pow(v[i], 2);
		}
		result = Math.sqrt(result);
		return result;
	},

	add_: function(v1, v2){
		result = [];
		for (var i =0; i<v1.length; i++){
			result.push(v1[i]+v2[i]);
		}
		return result;
	},

	subtract_: function(v1, v2){
		result = [];
		for (var i =0; i<v1.length; i++){
			result.push(v1[i]-v2[i]);
		}
		return result;
	},

	divide_scalar: function(v, s){
		result = [];
		for (var i=0; i<v.length; i++){
			result.push(v[i]/s);
		}
		return result;
	},

	mult_scalar: function(v, s){
		result = [];
		for (var i=0; i<v.length; i++){
			result.push(v[i]*s);
		}
		return result;
	}
}

function deriv(f, x, i){
	var h = 0.0001;
	var copy_ = globals.copy(x);
	copy_[i] = copy_[i]+h;
	return (f(copy_) - f(x))/h;
}


function objective(v){
	var x = v[0];
	var y = v[1];
	return 2*x + 3*y - 1 ;
}


function begin_gradient_min(x){
	var vertices = [
		x.map(function(n){return Math.random();}),
		x.map(function(n){return Math.random();}),
		x.map(function(n){return Math.random();}),
	];

	var n_iters = 1000;
	var vert = [];
		for (var j=0; j<vertices.length; j++){
			vert.push( objective(vertices[j]) );
		}

		var b = vertices[vert.indexOf(Math.min.apply(Math, vert))];
		var b_i = vert.indexOf(Math.min.apply(Math, vert));
		var w = vertices[vert.indexOf(Math.max.apply(Math, vert))];
		var w_i = vert.indexOf(Math.max.apply(Math, vert));
		var g = vertices[vert.indexOf(vert.sort(function(a, b){return a-b;})[1])];
		var g_i = vert.indexOf(vert.sort(function(a, b){return a-b;})[1]);

	for(var i=0; i<n_iters; i++){
		
	
		var m = globals.divide_scalar(globals.add_(b, g), 2);
		var r = globals.subtract_( globals.mult_scalar(m, 2),  w);


		if (objective(r) < objective(g)){
			if (objective(b) < objective(r)){
				w = r;
			}
			else{
				var e = globals.subtract_( globals.mult_scalar(r, 2),  m);
				if (objective(e) < objective(b)){
					w = e;
				}
				else{
					w = r;
				}
			}
		}
		else{
			if (objective(r) < objective(w)){
				w = r;
			}
			c = globals.divide_scalar(globals.add_(w, m), 2);
			if (objective(c) < objective(w)){
				w = c;
			}
			else{
				s = globals.divide_scalar(globals.add_(b, w), 2);
				w = s;
				g = m;
			}
			
		}

		vertices[b_i] = b;
		vertices[g_i] = g;
		vertices[w_i] = w;


		//console.log(w, b, g);


		console.log(objective(b), objective(g), objective(w));
	}



	//console.log(vertices);

}

begin_gradient_min([0, 0]);