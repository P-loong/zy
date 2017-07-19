//点击返回首页
$('.jia').click(function(){
	location.href = 'index.html';
})
//点击返回上一页
$('.back').click(function(){
	history.go(-1);
})

	// 点击上传按钮 提交数据
	$('form').submit(function(event){
			event.preventDefault();
			// 1获取表单数据
			var data = new FormData(this);
			// 2发送post请求传送数据给后台
			$.post({
				url:'/photo',
				data:data,
				contentType:false,
				processData:false,
				success:function(resData){
					alert(resData.message);
					if(resData.code == '1'){
						location.href = 'index.html'
					}
				}

			}); 
		});