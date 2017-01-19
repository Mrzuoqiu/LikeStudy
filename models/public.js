//是否登录
function isLogin(req,res,next){
	var name = req.session.user;
	if(name){
		next();
	}else{
		console.log('请登录')
		res.redirect('/userLogin');

	}
}

function first(){
	
}

var funObj = {
	isLogin:isLogin
}

module.exports = funObj;