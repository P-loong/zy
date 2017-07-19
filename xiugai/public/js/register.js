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
		// 阻止表单提交的默认事件
		event.preventDefault();
		var passwords = $('input[type=password]').map(function(){
			// 把每次遍历的密码信息返回
			return $(this).val();
		})

		if(passwords[0] != passwords[1]){
			// 提示用户两次输入的密码不一致
			alert('两次输入的密码不一致，请重新填写...')
			return;
		}
		// 发送post请求注册新用户
		// 获取表单数据 js代码
		// var data = new FormData(this)
		// serialize()用于提交表单元素的值，编码成字符串格式的
		var data = $(this).serialize();
		$.post('/register',data,function(resData){
			alert(resData.message);
			if (resData.message == '注册成功！') {
					location.href = 'index.html';
				}
		})
	})
