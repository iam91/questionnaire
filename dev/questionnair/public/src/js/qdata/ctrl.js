define(['jquery', 'echarts', 'qbody', 'qdataserv'], function($, echarts, qbody, QdataServ){

	var Qtype = ['单选题','多选题','文本题'];

	var QTYPE = {
		'SINGL': 0,
		'MULTI': 1,
		'QUEST': 2
	};

	var pieOption = {
	    backgroundColor: '#ffffff',

	    tooltip:{
	    	show: true,
	        trigger: 'item',
	        formatter: "{b} : {c} ({d}%)",
	    },

	    series : [
	        {
	            type:'pie',
	            data: null,
	            radius : '55%',
	            center: ['50%', '50%'],
	            roseType: false,
	            label: {
	                normal: {
	                    textStyle: {
	                        color: 'rgba(0, 0, 0, 1)'
	                    }
	                }
	            },
	            labelLine: {
	                normal: {
	                    lineStyle: {
	                        color: 'rgba(0, 0, 0, 1)'
	                    },
	                    smooth: 0.2,
	                    length: 10,
	                    length2: 20
	                }
	            }
	        }
	    ]
	};

	var barOption = {
	    backgroundColor: '#ffffff',

	    tooltip: {
	    	trigger: 'axis',
	        axisPointer : {           
	            type : 'shadow' 
	        }
	    },

	    xAxis: {
	        type: 'value',
	    },

	    yAxis: {
	    	type: 'category',
	    	data: ['']
	    },

	    series: [
	        {
	            name: '有效',
	            type: 'bar',
	            data: null,
	            stack: '所有'
	        },
	        {
	        	name: '无效',
	            type: 'bar',
	            data: null,
	            stack: '所有'
	        }
	    ]
	};

	var itemTextTemplate =  '<div>' + 
								'<label>{seq}</label>' + 
								'<label>{type}</label>' + 
								'<label>{title}</label>' + 
							'</div>' + 
							'<ul></ul>';

	//render functions
	function renderQnair(data){
		if(data){
			var q = data.q;
			var tot = data.tot;
			var data = data.data;

			var back = document.createElement('div');

			//questionnair head
			var qhead = $(document.createElement('div'))
							.addClass('q-detail-head')
							.html('<span>' + q.title + '</span>');
			
			//questionnair body
			var qbody = $(document.createElement('div')).addClass('q-detail-body');
			for(var i = 0; i < q.items.length; i++){

				var item = q.items[i];
				var type = item.type;

				var itemDiv = document.createElement('div');
				$(itemDiv).addClass('q-data-item');
				

				$(document.createElement('div')).addClass('q-data-text')
												.html(itemTextTemplate
													.replace('{seq}', i)
													.replace('{type}', Qtype[type])
													.replace('{title}', item.title))
												.appendTo(itemDiv);


				var chart = document.createElement('div');
				$(chart).addClass('q-data-chart')
						.appendTo(itemDiv);
				
				//draw chart
				if(type != QTYPE.QUEST){

					chart.style.width = '300px';
					chart.style.height = '200px';
					chart = echarts.init(chart);

					var d = [];
					var li = '';
					for(var j = 0; j < data[i].length; j++){
						d.push({
							value: data[i][j],
							name: item.content.opts[j].des
						});

						li += '<li>' + '<' + (j + 1) + '> ' + item.content.opts[j].des + '</li>';
					}

					$(itemDiv).find('.q-data-text ul').html(li);

					pieOption.series[0].data = d;
					chart.setOption(pieOption);
				}else{
					chart.style.width = '300px';
					chart.style.height = '150px';
					chart = echarts.init(chart);

					barOption.series[0].data = [data[i][0] / tot];
					barOption.series[1].data = [(tot - data[i][0]) / tot];
					chart.setOption(barOption);
				}

				$(qbody).append(itemDiv);
			}
			//questionnair foot
			var qfoot = document.createElement('div');
			$(qfoot).html('<a class="btn btn-enable" href="#qlist">< 返回</a>')
					.addClass('q-data-foot')

			$(back).addClass('q-back q-back-white')
				   .append(qhead)
				   .append(qbody)
				   .append(qfoot)
				   .appendTo(_$root);
		}
	}

	function existQnair(data){
		renderQnair(data);
	}

	function noQnair(){
		var back = document.createElement('div');
		$(back).addClass('q-back q-back-white').html('<span>Oops!</span>');
	}

	var _$root = null;
	var _$globalStorage = null;
	var _modal = null;

	function render($root, $globalStorage){

		_$root = $root;
		_$globalStorage = $globalStorage;
		_modal = _$globalStorage.modal;

		var qid = _$globalStorage.qid;
		if(qid){
			QdataServ.query(qid)
					 .done(existQnair)
					 .fail(noQnair);
		}else{
			noQnair();
		}
	}

	return {
		render: render
	};
});