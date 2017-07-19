var btn1 = document.querySelector('#btn1')
btn1.onclick = function(){
	location.href = 'quiz.html'
}

var btn2 = document.querySelector('#btn2')
btn2.onclick = function(){
	location.href = 'dlApp.html'
}

// 用于首页的信息处理，包括  用户信息处理和用户昵称显示、 留言板信息的显示

// 从本地缓存cookie中取出petname的值
		var petname = $.cookie('petname');

		// 判断有没有昵称petname  如果有显示昵称，如果没有显示“登录”
		if(petname){
			$('#btn2 a').text(petname);
			btn2.onclick = function(){
				$('ul').toggle()
			}
		}else{
			// $('#user').find('span').last().text('登录');
			// end() 往上往外层找匹配的元素
			$('#btn2 a').text('登录').end().end().removeAttr('data-toggle').click(function(){
				location.href = 'dlApp.html'
			})
		}

		// 提问按钮 ➕  如果昵称存在跳转到ask.html，如果不存在跳转到login.html	
		$('#btn1 a').click(function(){
			// if(petname){
			// 	location.href = 'ask.html'
			// }else{
			// 	location.href = 'login.html'
			// }
			petname?location.href = 'quiz.html':location.href = 'dlApp.html'

		})




// 获取首页数据
$.get('/question/all',function(resData){
//	console.log(resData);
	// 拼接HTML标签和上面要显示的内容 
	var htmlStr = '';
	for(var i = 0; i < resData.length; i++){
		// 采用的是 Bootstrap 里面的多媒体对象
		var question = resData[i];
		// 这是外层
		htmlStr += '<div class="bottom">'
		// 内层第一块,显示头像的地方 pull-left
		htmlStr += '<section class="leftF"><a href="#">'
		htmlStr += '<img src="uploads/' + question.petname + '.jpg" onerror="defaultHeaderImage(this)">'
		htmlStr += '</a>'
		// 内层第二块,显示问题用的
		htmlStr += '<h3>' + question.petname + '</h3>'
		htmlStr += '<p>' + question.content + '</p>'
		htmlStr += '<strong>' + formatDate(new Date(question.time)) + '&#x3000;' + formatIp(question.ip) + '</strong>';
		htmlStr += '</section></div>'
		
		// 判断这个问题 是否有人回答过
		if(question.answers){
			// 有人回答过,显示回答
			for(var j = 0; j < question.answers.length; j++){
				var answer = question.answers[j];
				htmlStr += '<div class="bottom">'
				htmlStr += '<section class="rightF"><a href="#">'
				htmlStr += '<img src="uploads/' + answer.petname + '.jpg" onerror="defaultHeaderImage(this)">'
				htmlStr += '</a>'
				htmlStr += '<h3>' + answer.petname + '</h3>'
				htmlStr += '<p>' + answer.content + '</p>'
				htmlStr += '<strong>' + formatDate(new Date(answer.time)) + '&#x3000;' + formatIp(answer.ip) +'</strong>';
				htmlStr += '</section></div>'
			}	
		}
		htmlStr += '</hr>'
		
		
	}
	$('.questions').html(htmlStr);
});
// 封装一个方法,解析 date用的
function formatDate(time){
	var y = time.getFullYear();
	var M = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var m = time.getMinutes();
	M = M < 10 ? '0' + M : M;
	d = d < 10 ? '0' + d : d;
	h = h < 10 ? '0' + h : h;
	m = m < 10 ? '0' + m : m;
	// 返回例如 : 2017-03-23
	return y + '-' + M + '-' + d + ' ' + h + ':' + m;
}

// 封装一个方法,解析 ip 用的
function formatIp(ip){
	console.log(ip);
	if(ip.startsWith('::1')){
		return 'localhost';
	}
	else{
		return ip.substr(7);
	}
}
 

 

// 给每个问题添加点击事件
$('.questions').on('click','.leftF',function(){
	if(petname){
		// 用户已经登录了
		// 把 data-question 的值存到 cookie 中
		$.cookie('question',$(this).data('question'));
		
		location.href = 'answer.html';
	}
	else{
		// 用户未登录,请先登录
		location.href = 'dlApp.html';
	}
}) 

// 如果没有上传头像 可以设置默认头像
function defaultHeaderImage(tou){
	tou.src = 'images/timg.jpg';
}


// 退出登录
$('#logout').click(function(){
	$.get('/logout',function(resData){
		// 重新加载页面
		location.reload();
	})
})