// 加载模块
var express = require('express');
var bodyParser = require('body-parser');

// 处理缓存cookie
var cookieParser = require('cookie-parser');

// 文件对象
var fs = require('fs');
var multer = require('multer');

// 配置储存上传文件的 storage
var storage = multer.diskStorage({
    // 图片文件夹存储路径
	destination: 'public/uploads',
    // 文件名称
	filename: function(req,res,callback){
		var petname = req.cookies.petname;
		callback(null,petname + '.jpg')
	}
});
var upload = multer({storage});



// 创建服务器对象
var app = express();

// 配置静态文件夹
app.use(express.static('public'))
// 解析post请求参数
app.use(bodyParser.urlencoded({extended:true}));
// 解析cookie参数的中间件
app.use(cookieParser());


/*******************1 注册*********************/
app.post('/register',function(req,res){
   
    console.log('已进入注册请求。。。')

    // 创建文件存储新用户注册的信息
    fs.exists('users',function(exist){
        if(exist){
            // 存在文件夹，就直接写入数据
            writeFile();
        }else{
            // 不存在文件夹，创建文件夹，然后在写入数据
            fs.mkdir('users',function(err){
                if(err){
                    res.status(200).json({
                        message:'系统创建文件失败！'
                    })
                }else{
                    // 创建文件成功，开始写入数据，调用函数
                    writeFile();
                }
            })
        }
    });

    // 封装函数将用户信息写入本地
    function writeFile(){
        // 判断用户是否已经注册过
        var fileName = 'users/'+req.body.account + '.txt';
        fs.exists(fileName,function(exist){
            if(exist){
                // 用户已经被注册过了
                res.status(200).json({message:"用户名已经存在，请重新注册！"})
            }else{
                // 用户不存在，可以注册
                // 将用户信息写入本地
                fs.writeFile(fileName,JSON.stringify(req.body),function(err){
                    if(err){
                        res.status(200).json({
                            message:"写入文件操作失败！"
                        });
                    }else{
                        res.status(200).json({
                            code:'1',
                            message:"注册成功！"
                        });
                    }
                }); 
            } 
        });
    } 
});


/*******************2 登录*********************/
app.post('/login',function(req,res){
    // 根据用户名 获取文件名称，如果文件存在就去判断密码是否一致
    var fileName = 'users/'+ req.body.account + '.txt';
    fs.exists(fileName,function(exist){
        if(exist){
            // 文件存在
            // 读取文件里面的数据
            fs.readFile(fileName,function(err,data){
                if(err){
                    res.status(200).json({
                        message:"文件读取失败！"
                    });
                }else{
                    // 文件读取成功，进行密码判断
                    var userData = JSON.parse(data);
                    if(userData.password == req.body.password){
                        // 密码一致，登录成功
                        // 1 把petname设置到cookie里（缓存到当前网页内）
                        // 定义一个缓存有效期,以当前日期为参照
                        var expires = new Date();
                        expires.setMonth(expires.getMonth()+1);
                        res.cookie('petname',req.body.account,{expires})
                        // 2 数据缓存完后 做登录成功提示
                        res.status(200).json({
                            code:"1",
                            message:"登录成功！"
                        });
                    }
                    else{
                        res.status(200).json({
                            message:"密码错误，丢人！"
                        });
                    }
                }
            });
        }else{
            // 文件不存在
            res.status(200).json({
                message:"用户不存在，请先去注册！"
            })
        }
    })
});




/*******************3 提问*********************/
app.post('/quiz',function(req,res){
    
	// console.log(res.cookie('petname'));
	console.log(req.cookies);


    // 判断缓存cookie里面是否有把petname传递过来
    if(!req.cookies.petname){
        res.status(200).json({
            message:"登录超时，请重新登录！"  
        })
        return ;
    } 
    // 判断存储问题的文件夹是否存在
    fs.exists('questions',function(exist){
        if(exist){
            // 如果文件存在 把问题写入文件
            writeFile();
        }else{
            // 如果文件不存在 先创建文件，再把问题写入文件
            fs.mkdir('questions',function(err){
                if(err){
                    // 文件创建失败
                    res.status(200).json({
                            message:"文件创建失败！"  
                        })
                }else{
                    // 文件创建成功 
                    writeFile();
                }   
            })
        }
    })
    // 把问题写入文件
    function writeFile(){
        // 设置文件名称 以时间 毫秒 命名
        var date = new Date();
        var fileName = 'questions/'+ date.getTime() + '.txt';
        // 存储信息  昵称、ip、时间
        req.body.petname = req.cookies.petname
        req.body.ip = req.ip
        req.body.time = date

        // 写入文件
        fs.writeFile(fileName,JSON.stringify(req.body),function(err){
            if(err){
                res.status(200).json({
                        message:"写入文件失败！"  
                    });
            }else{
                res.status(200).json({
                        code:"1",
                        message:"大功告成！！"  
                    });
            }
        }) 
    }
})




/*******************首页数据*********************/
app.get('/question/all',function(req,res){
    // 读取所有的questions文件夹里面数据
    fs.readdir('questions',function(err,files){
        if(err){
            res.status(200).json({ message:"文件夹读取失败咯！"  });
        }else{
            // 将文件逆序
            files = files.reverse();
            // 定义一个数组来存放一个问题数据
            var questions = [];
            // 有多少个文件 就遍历多少次
            for(var i=0;i<files.length;i++){
                var file = files[i];
                // 获取路径
                var filePath = 'questions/'+file
                // fs.readFile() //是一个异步读取文件的方法，
                // 会导致文件还没有读取完就res了，没有数据返回或者返回的数据不完整
                // fs.readFileSync同步读取
                var data = fs.readFileSync(filePath)
                // 把字符串转换为对象json,存到数组中
                var object = JSON.parse(data)
                // 将对象添加到数组中
                questions.push(object);
            }
            // 把数据数组响应给客户端
            res.status(200).json(questions);
        }
    })

})



/*******************回答问题*********************/
app.post('/user/answer',function(req,res){
	// 判断登录的状态
	 
	if(!req.cookies.petname){
		res.status(200).json({code:0,message:'登录异常,请重新登录'});
		return;
	} 
	// 先取出要回答问题的内容
	// 找到要回答问题的文件
	var question = req.cookies.question;
	var filePath = 'questions/' + question + '.txt';
	fs.readFile(filePath,function(err,data){
		if(!err){
			var object = JSON.parse(data);
			// 判断当前文件是否有回复
			if(!object.answers){
				// 此数组存放回复内容用的
				object.answers = [];
			} 
			// 将回答的内容接收
            // 防止跨网站攻击,将< > 转义字符替换掉
            req.body.content = req.body.content.replace(/</g,'&lt;');
            req.body.content = req.body.content.replace(/>/g,'&gt;');
			
			req.body.ip = req.ip;
			req.body.question = question;
			req.body.time = new Date();
			req.body.petname = req.cookies.petname;
			// 将回复 放到数组中
			object.answers.push(req.body);
			fs.writeFile(filePath,JSON.stringify(object),function(err){
				if (err){
					// 写入失败
					res.status(200).json({message:'系统错误,写入文件失败'});
				}else{
					// 写入成功
					res.status(200).json({code:1,message:'回复成功'});
				}
			});	
		}
	});
});


/*******************上传头像*********************/
app.post('/user/photo',upload.single('photo'),function(req,res){

    res.status(200).json({
        code:"1",
        message:"大头贴已上传！"
    })
})


/*******************退出登录*********************/
app.get('/user/logout',function(req,res){
    // 清除缓存的昵称
    res.clearCookie('petname')
    res.status(200).json({
        message:"退出成功！"
    });
});



app.listen(3000,function(){
    console.log('服务器已开启！');
});