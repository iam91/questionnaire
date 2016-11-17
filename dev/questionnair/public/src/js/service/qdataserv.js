define(['jquery'], function($){

	function query(id){
		return $.ajax('/qdata/' + (id || ''), {
			method: 'GET',
			dataType: 'json'
		});
	}

	function create(data){
		return $.ajax('/qdata/', {
			method: 'POST',
			data: JSON.stringify(data),
			dataType: 'json',
			processData: false,
			contentType: "application/json; charset=utf-8"  
		});
	}

	return {
		query: query,
		create: create
	};
});