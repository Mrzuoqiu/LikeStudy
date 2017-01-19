var express = require('express');
var router = express.Router();

var public = require('../models/public.js');
var url = require('url');
var http = require('http');
//验证
var validator = require('validator');
//引入用户信息模块
var User = require('../models/User');
//引入资料模块
var Book = require('../models/book');
//上传头像
var upLoadPic = require('../models/multer');
//引入问答文章信息模块
var Article = require('../models/article');
var DBSet = require('../models/db');
//加密类
var crypto = require('crypto');
//时间格式化
var moment = require('moment');
//站点的配置
var settings = require('../models/db/settings');
var shortid = require('shortid');

/* GET home page. */

//注册页面
router.get('/reg',function(req,res,next){
    var arg = url.parse(req.url).path;
    var regBack = req.session.regBack;
    res.render('userReg',{
        title:'用户注册',
        path:arg,
        regBack:regBack
    });
})

router.get('/userLogin',function(req,res,next){
    var arg = url.parse(req.url).path;
//    var loginBack = req.session.loginBack;
    res.render('userLogin',{
        title:'用户注册',
        path:arg,
//        loginBack:loginBack
    });
})

router.post('/userLogin',function (req,res,next) {
    var email = req.body.email;
    // console.log(email);
    var password = req.body.password;
    var newPsd = DBSet.encrypt(password,settings.encrypt_key);
    if(!validator.isEmail(email)){
        errors = '邮箱格式不正确'
    }
    if(!validator.matches(password,/(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,}/) || !validator.isLength(password,6,12)){
        errors = '密码6-12个字符';
    } else {
        User.findOne({email:email,password:newPsd},function(err,user){
            // console.log(user);
            if(user){
                //存入session
                req.session.user = user;
                req.flash('success','登录成功');
                res.end('success');
            }else{
                res.end('用户名或者密码错误!');
            }
        })
    }
})
//注册行为
router.post('/doReg',function(req,res,next){

    var errors;
    var userName = req.body.userName;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPsd = req.body.confirmPassword;
    //检验数据
    if(!validator.matches(userName,/^[a-zA-Z][a-zA-Z0-9_]{4,11}$/)){
        errors = "用户名5-12个英文数字组合";
    }
    if(!validator.matches(password,/(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,}/) || !validator.isLength(password,6,12)){
        errors = "密码6-12位，只能包含字母、数字和下划线";
    }
    if(password !== confirmPsd)
    {
        errors = "密码不匹配，请重新输入";
    }
    if(!validator.isEmail(email)){
        errors = "请填写正确的邮箱地址";
    }
    if(errors){
        res.end(errors);
    }else{
        //邮箱和用户名都必须唯一
        var query=User.find().or([{'email' : email},{userName : userName}]);
        query.exec(function(err,user){
            if(user.length > 0){
                errors = "邮箱或用户名已存在！";
                res.end(errors);
            }else{
                var newPsd = DBSet.encrypt(password,settings.encrypt_key);
                req.body.password = newPsd;
                User.create(req.body,function (err,users) {

                    // User.findOne({email:req.body.email},function (err,user) {
                        console.log('999' + users)
                        req.session.user = users;
                    res.end('success');
                    // })

                });





            }
        });
    }
})

//登陆行为
router.post('/doLogin',function (req,res,next) {
    var email = req.body.email;
    // console.log(email);
    var password = req.body.password;
    var newPsd = DBSet.encrypt(password,settings.encrypt_key);
    if(!validator.isEmail(email)){
        errors = '邮箱格式不正确'
    }
    if(!validator.matches(password,/(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,}/) || !validator.isLength(password,6,12)){
        errors = '密码6-12个字符';
    } else {
        User.findOne({email:email,password:newPsd},function(err,user){
            // console.log(user);
            if(user){
                //存入session
                req.session.user = user;
                req.flash('success','登录成功');
                res.end('success');
            }else{
                res.end('用户名或者密码错误!');
            }
        })
    }
})
//首页
router.get('/',function(req, res, next) {
    var arg = url.parse(req.url).path;

    req.session.regBack = arg;
        res.render('first',{
            // title:'欢迎访问',
            user:req.session.user,
            path:arg
        });

});
//书本BOOK页
router.get('/index', function(req, res, next) {
    var arg = url.parse(req.url).path;
    req.session.regBack = arg;
    Book.find({},function (err,books) {
        // console.log(books[0])
        res.render('index',{
            // title:'欢迎访问',
            books:books,
            user:req.session.user,
            path:arg
        });
    })
});
//先选择科目
router.get('/index/:lesson/zz', function(req, res, next) {
    // console.log('语文');
    var arg = url.parse(req.url).path;
    req.session.regBack = arg;
    Book.find({lesson: req.params.lesson}, function (err, books) {
        res.render('indextwo', {
            // title:'欢迎访问',
            books: books,
            user: req.session.user,
            path: arg,
            // layout:"/public/mainTemp"
        });
    })
})
//再选择年级
router.get('/index/:lesson/:grade', function(req, res, next) {
    var arg = url.parse(req.url).path;
    req.session.regBack = arg;
    Book.find({lesson: req.params.lesson,grade:req.params.grade}, function (err, books) {
        res.render('indextwo', {
            // title:'欢迎访问',
            books: books,
            user: req.session.user,
            path: arg

        })
    })
})
//先年级再科目...暂时还不会-.-  两者不可兼得0.0 然而还是搞了出来*.*
router.get('/index/mm/:grade/ww', function(req, res, next) {
    // console.log('语文');
    var arg = url.parse(req.url).path;
    req.session.regBack = arg;
    Book.find({grade: req.params.grade}, function (err, books) {
        res.render('indexthree', {
            // title:'欢迎访问',
            books: books,
            user: req.session.user,
            path: arg,
            // layout:"/public/mainTemp"
        });
    })
})
//再选择科目
router.get('/index/mm/:grade/:lesson', function(req, res, next) {
    var arg = url.parse(req.url).path;
    req.session.regBack = arg;
    Book.find({lesson: req.params.lesson,grade:req.params.grade}, function (err, books) {
        res.render('indexthree', {
            // title:'欢迎访问',
            books: books,
            user: req.session.user,
            path: arg

        })
    })
})
//单个资料文章详情
// router.get('/index/:lesson/:grade/:title/author',function (req,res,next) {
//     var arg = url.parse(req.url).path;
//     req.session.regBack = arg;
//     Article.findOne({lesson:req.params.lesson,title:req.params.title,author:req.params.author,grade:req.params.grade},function (err,doc) {
//         // console.log(docs);
//         res.render('useranswer',{
//             // title:'欢迎访问',
//             docs:doc,
//             user:req.session.user,
//             path:arg
//             // Article:res.json(result)
//         });
//     });
// })
//问答文章页
// router.get('/useranswer', function(req, res, next){
//     var arg = url.parse(req.url).path;
//     req.session.regBack = arg;
//     // console.log(arg);
//     Article.find({}).sort({date:-1}).exec(function (err,docs) {
//     res.render('useranswer',{
//         // title:'欢迎访问',
//         docs:docs,
//         user:req.session.user,
//         path:arg
//     });
//     });
// });
router.get('/useranswer', function(req, res, next){
    var arg = url.parse(req.url).path;
    var page = parseInt(req.query.p) || 1;
    req.session.regBack = arg;
    // console.log(arg);
    Article.find({}).skip((page - 1)*12).limit(12).sort({date:-1}).exec(function (err,docs) {
        Article.count({},function (err,total) {
            console.log('0.0' + total);
            res.render('useranswer',{
                // title:'欢迎访问',
                total:total,
                docs:docs,
                page:page,
                user:req.session.user,
                isFirstPage: (page - 1) == 0,
                isLastPage: (page - 1) * 12 + docs.length == total,
                path:arg
            });
        })

    });
});

///
router.get('/useranswer/request', function(req, res, next) {
    var arg = url.parse(req.url).path;
    var page = parseInt(req.query.p) || 1;
    req.session.regBack = arg;
    // console.log(arg);
    Article.find({selection:'question'}).skip((page - 1)*12).limit(12).sort({date:-1}).exec(function (err,docs) {
        Article.count({selection:'question'},function (err,total) {
            console.log('0.0' + total);
            res.render('useranswer',{
                // title:'欢迎访问',
                total:total,
                docs:docs,
                page:page,
                user:req.session.user,
                isFirstPage: (page - 1) == 0,
                isLastPage: (page - 1) * 12 + docs.length == total,
                path:arg
            });
        })

    });
});
router.get('/useranswer/share', function(req, res, next) {
    var arg = url.parse(req.url).path;
    var page = parseInt(req.query.p) || 1;
    req.session.regBack = arg;
    // console.log(arg);
    Article.find({selection:'share'}).skip((page - 1)*12).limit(12).sort({date:-1}).exec(function (err,docs) {
        Article.count({selection:'share'},function (err,total) {
            console.log('0.0' + total);
            res.render('useranswer',{
                // title:'欢迎访问',
                total:total,
                docs:docs,
                page:page,
                user:req.session.user,
                isFirstPage: (page - 1) == 0,
                isLastPage: (page - 1) * 12 + docs.length == total,
                path:arg
            });
        })

    });
});
///////////////////
// router.get('/articleTotle',function (req,res,next) {
//     var params = url.parse(req.url,true);
//     var tag = params.query.tag;
//     var page = params.query.page;
//     Article.find({}).skip((page - 1)*15).limit(15).exec(function (err,total) {
//         Article.find({}).exec(function (err,allart) {
//             total.push(allart.length);
//             console.log('55');
//             return res.json(total);
//         })
//
//     })
// })
// router.get('/article_Totle',function (req,res,next) {
//     var params = url.parse(req.url,true);
//     var tag = params.query.tag;
//     var page = params.query.page;
//     Article.find({selection:tag}).skip((page - 1)*15).limit(15).exec(function (err,total) {
//         Article.find({selection:tag}).exec(function (err,allart) {
//             total.push(allart.length);
//             console.log('55');
//             return res.json(total);
//         })
//
//     })
// })


////////////////////
//问答发表行为
router.post('/doArticleAdd',function (req,res,next) {
    // var errors;
    // var title = req.body.title;
    // var content = req.body.message;
    var date = new Date();
    var time = {
        date:date,
        year:date.getFullYear(),
        month:date.getFullYear() + '-' + (date.getMonth() + 1),
        day:date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' + date.getDate(),
        minute:date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
        date.getHours() + ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':' + date.getSeconds())
    };
    req.body.time = time.minute;
    req.body.author = req.session.user.userName;
    req.body.email = req.session.user.email;
    req.body.authorpic = req.session.user.userpic;
    Article.create(req.body,function (doc) {
        res.end("success");
        // return res.json(doc);

    })

})
//问答 详情页面  get路径待改
// router.get('/useranswer/:title/:author/:time',function (req,res,next) {
//     var arg = url.parse(req.url).path;
//     req.session.regBack = arg;
//     Article.findOne({title:title,author:author,time:time},function (err,doc) {
//         // console.log(docs);
//         res.render('useranswer',{
//             // title:'欢迎访问',
//             docs:doc,
//             user:req.session.user,
//             path:arg
//             // Article:res.json(result)
//         });
//     });
// })
// //问答修改页面
// router.get('/edit/:title/:author/:time',function (req,res,next) {
//     var arg = url.parse(req.url).path;
//     req.session.regBack = arg;
//     Article.findOne({title:title,author:author,time:time},function (err,doc) {
//         // console.log(docs);
//         res.render('useranswer',{
//             // title:'欢迎访问',
//             docs:doc,
//             user:req.session.user,
//             path:arg
//         });
//     });
// })

//问答修改行为


//个人资料页面
router.get('/userModify',public.isLogin,function (req,res,next) {
    var arg = url.parse(req.url).path;
    req.session.regBack = arg;
    var email = req.session.user.email;
    User.findOne({email:email},function (err,result) {
        res.render('userModify',{
            user:result,
            path:arg,
        })
    })


})
//ajax获取用户信息
router.get('/userInfo',function (req,res,next) {
    var params = url.parse(req.url,true);
    var email = params.query.uid;
    User.findOne({email:email},function (err,result) {
        if (err){
            console.log(err);
        }else {
            return res.json(result);
        }
    })
})

////修改个人资料
router.post('/doUserModify',public.isLogin,function(req,res,next){
    var email = req.session.user.email;
    var message = req.body;
    User.update({email:email},{$set:message},function(err,user){
        req.session.user = req.body;
        res.end('success');

    })

})

//修改头像
router.post('/doUserTouxiang',upLoadPic.single("userpic"),function(req,res,next){
    var id = req.session.user._id;
    var email = req.session.user.email;
    // console.log(req.picUrl);
    if(req.picUrl) {

        User.findByIdAndUpdate(id,{$set:{userpic:req.picUrl}},function (err,per) {
            User.findOne({_id:id},function (err,person) {
            Article.update({email:email},{$set:{authorpic:req.picUrl}},function (err) {
                console.log(err);
            })
            Article.update({comments:{email:email}},{$set:{comments:{commenter:req.picUrl}}},function (err) {
                console.log(err);
            })
            req.session.user = person;
            req.flash('success', '头像更换成功');
            res.redirect('/userModify');
            })
        })


    }else {
        res.end("请选择图片后上传");
    }

})
//修改密码
router.get('/changePassword',function (req,res,next) {

    var arg = url.parse(req.url).path;
    var regBack = req.session.regBack;
    req.session.regBack = arg;
    // var email = req.session.user.email;
        res.render('changePassword',{
            user:req.session.user,
            path:arg,
            regBack:regBack
        })
    });
//ajax获取信息返回到修改密码页面
router.get('/userchangpassword',function (req,res,next) {
    var params = url.parse(req.url,true);
    var email = params.query.uid;
    User.findOne({email:email},function (err,result) {
        if (err){
            console.log(err);
        }else {
            return res.json(result);
        }
    })
})

router.post('/doChangpassword',function(req,res,next){
    var id = req.session.user._id;
    var password = req.body.password;
    var newPsd = DBSet.encrypt(password,settings.encrypt_key);
    req.body.password = newPsd;
    User.findByIdAndUpdate(id,{$set:{password:req.body.password}},function(err,doc){
        User.findOne({_id:id},function (err,user) {
            req.session.user = user;
        })

        res.end('success');

    })


})



//退出
router.get('/u/:path',function(req,res){
    //1.清除session
    //2.给用户提示
    //3.刷新当前页
    // console.log(req.params.path);
    var back = req.params.path;
    req.session.user = null;
    req.flash('success','成功退出');
    res.redirect('/' + back);

    // console.log(arg);
})
//首页 first页面退出
router.get('/loginout',function(req,res){
    //1.清除session
    //2.给用户提示
    //3.刷新当前页
    // console.log(req.params.path);
    var back = req.params.path;
    req.session.user = null;
    req.flash('success','成功退出');
    res.redirect('/');

    // console.log(arg);
})



////////////////////  分页 关注/点赞 点击作者 搜索功能  登录判断(没有登录不能发表等)
//文章详情页面  get路径待改
router.get('/article/:author/:id/:title',function (req,res,next) {
    // var id = req.params.id;
    var arg = url.parse(req.url).path;
    req.session.regBack = arg;
//    var time = req.body.time;

        Article.update({_id:req.params.id},{$inc:{pv:1}},function (err,Art) {
            Article.findOne({_id:req.params.id},function (err,docs) {
                res.render('userQuestion',{
                    // title:'欢迎访问',
                    doc:docs,
                    user:req.session.user,
                    path:arg
                    // Article:res.json(result)
                });

            });

        })
        // console.log(docs);





})
//文章修改
router.get('/edit/:author/:id',function (req,res,next) {
    var arg = url.parse(req.url).path;
    req.session.regBack = arg;
    // var currentEmali = req.session.user.email;
    // User.find({email:currentEmali},function (err,user) {
    // var id = req.params.id;
    Article.findOne({_id:req.params.id},function (err,docs) {
        res.render('Edit', {
            doc:docs,
            user: req.session.user,
            path: arg
        })
    })
    // })
})

//文章修改获取数据
router.post('/updateArc/:author/:id',function(req,res,next){
    var id = req.params.id;
    var title = req.body.title;
    var message = req.body.message;
    var arg = url.parse(req.url).path;
    Article.findByIdAndUpdate(id,{$set:{title:title,message:message}},function(err,docs){
        Article.findOne({_id:id},function(err,docs){
            res.render('userQuestion',{
                doc:docs,
                user:req.session.user,
                path:arg
            })
        })
    })

})

//删除文章
router.get('/remove/:author/:id',function(req,res,next){
    var id = req.params.id;
    var arg = url.parse(req.url).path;
    var page = parseInt(req.query.p) || 1;
    Article.remove({_id:id},function(err,docs){
        Article.find({}).skip((page - 1)*12).limit(12).sort({date:-1}).exec(function (err,docs) {
            Article.count({},function (err,total) {
                console.log('0.0' + total);
                res.render('useranswer',{
                    // title:'欢迎访问',
                    total:total,
                    docs:docs,
                    page:page,
                    user:req.session.user,
                    isFirstPage: (page - 1) == 0,
                    isLastPage: (page - 1) * 12 + docs.length == total,
                    path:arg
                });
            })

        });
    })

})



//文章评论
router.post('/doCommentAdd',function(req,res,next){
    var params = url.parse(req.url,true);
    var id = params.query.uid;
    var name = req.session.user.userName;
    var content = req.body.content;
    var commenterpic = req.session.user.userpic;
    var email = req.session.user.email
    var date = new Date();
    var time = {
        date:date,
        year:date.getFullYear(),
        month:date.getFullYear() + '-' + (date.getMonth() + 1),
        day:date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' + date.getDate(),
        minute:date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
        date.getHours() + ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':' + date.getSeconds())
    };
    req.body.time = time.minute;
    console.log(id);
    console.log(name);
    console.log(content);
    Article.update({_id:id},{$push:{comments:{name:name,content:content,commenterpic:commenterpic,email:email,time:req.body.time}}},function(err,docs){
        res.end('success');
    })
})
router.post('/search',function(req,res,next){
    var title_s = req.body.title;
//    var title = req.params.title;
    var page = parseInt(req.query.p) || 1;
    var arg = url.parse(req.url).path;
    Article.find({title:title_s}).skip((page - 1)*12).limit(12).sort({date:-1}).exec(function (err,docs) {
        Article.count({},function (err,total) {
            console.log('0.0' + total);
            res.render('useranswer',{
                // title:'欢迎访问',
                total:total,
                docs:docs,
                page:page,
                user:req.session.user,
                isFirstPage: (page - 1) == 0,
                isLastPage: (page - 1) * 12 + docs.length == total,
                path:arg
            });
        })

    });
})


router.get('/author/:author',function(req,res,next){
    var author = req.params.author;
    var arg = url.parse(req.url).path;
    Article.find({author:author},function(err,docs){
        User.findOne({userName:author},function(err,signs){
            res.render('userInfo',{
                docs:docs,
                signs:signs,
                user:req.session.user,
                path:arg
            })
        })

    })
})





module.exports = router;
