//点击返回首页
$('.jia').click(function(){
	location.href = 'register.html';
})
//点击返回上一页
$('.back').click(function(){
	history.go(-1);
})

$('form').submit(function(event){
	event.preventDefault();
	var data = $(this).serialize();//以拼接的形式获取全部form的数据
	$.post('/login',data,function(resData){
		alert(resData.message);
		if (resData.message == '登录成功！') {			
			location.href = 'index.html'
		}
	})
})