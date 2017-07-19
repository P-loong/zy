// 点击左侧返回按钮
	$('.back').click(function(){
		// location.href = 'index.html'
		// history.back()
		history.go(-1)
		// 以上三种写法都能返回
	})

	// 点击右侧首页按钮
	$('.jia').click(function(){
		location.href = 'index.html'
	})

 $('form').submit(function(event){
			event.preventDefault();
			var data = $(this).serialize();
			// 发送post 提问 请求
			$.post('/answer',data,function(resData){
				alert(resData.message)
				// 将模态框弹出
				// hide.bs.modal事件：模态框消失的时候触发的事件			
					if(resData.code == '1'){
						location.href = 'index.html'
					}
			});
		});