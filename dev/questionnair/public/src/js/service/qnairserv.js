define(['jquery'], function($){

	function query(id){
		return $.ajax('/qnair/' + id || '', {
			dataType: 'json',
			method: 'GET'
		});
	}

	function update(data, id){
		return $.ajax('/qnair/' + id, {
			method: 'PUT',
			data: JSON.stringify(data),
			dataType: 'json',
			processData: false,
			contentType: "application/json; charset=utf-8"  
		});
	}

	function create(data){
		return $.ajax('/qnair/', {
			method: 'POST',
			data: JSON.stringify(data),
			dataType: 'json',
			processData: false,
			contentType: "application/json; charset=utf-8"  
		});
	}

	function del(id){
		var url = '/qnair/';
		for(var i = 0; i < id.length; i++){
			url += (id[i] + i == id.length -1 ? '' : ',');
		}
		return $.ajax('/qnair/' + id, {
			method: 'DELETE',
			dataType: 'json'
		});
	}

	return {
		query: query,
		create: create,
		update: update,
		del: del
	};
});