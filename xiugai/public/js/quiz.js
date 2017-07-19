//点击返回首页
$('.jia').click(function(){
	location.href = 'index.html';
})
//点击返回上一页
$('.back').click(function(){
	history.go(-1);
})

    $('form').submit(function(event){
			event.preventDefault();
			var data = $(this).serialize();
			// 发送post 提问 请求
			$.post('/quiz',data,function(resData){
				alert(resData.message)
					if(resData.code == '1'){
						location.href = 'index.html'
					}
			});
		});