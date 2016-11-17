define(function(){

	return {

		dateFormat: function(d){
			return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		},

		dateLessEqual: function(a, b){
			return a.getFullYear() > b.getFullYear() ? false 
				: (a.getMonth() > b.getMonth() ? false
				: (a.getDate() > b.getDate() ? false : true));
		},

		dateTrans: function(str){
			var date = new Date(str);
			return date.toString() === 'Invalid Date' ? null : date;
		}

	};

});