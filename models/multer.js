/**
 * Created by june on 2016/11/19.
 */
var multer = require('multer');
var storage = multer.diskStorage({
  //设置文件上传路径，文件夹如果不存在会自动创建
  destination:function (req,file,cb) {
    cb(null,'public/userpic');
  },
  //给上传的文件重命名
  filename:function (req,file,cb) {
    req.file = file;
    console.log(file);
    var name = req.session.user.email;
    if(file.mimetype == 'image/jpeg') {
      req.picUrl = name + '.jpg';
    }else if(file.mimetype == 'image/png') {
      req.picUrl = name + '.png';
    }else if(file.mimetype == 'image/gif') {
      req.picUrl =name + '.gif';
    }
    cb(null,req.picUrl);
    console.log('666' + req.picUrl);
  }
});
//添加配置文件到multer对象
var upload = multer({
  storage:storage
});


//导出对象
module.exports = upload;
