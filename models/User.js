/**
 * Created by hama on 2016/12/8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var UserSchema = new Schema({
    _id:{
        type:String,
        unique:true,
        'default':shortid.generate
    },
    userName:String,
    sex:String,
    password:String,
    email:String,
    qq:{type:String,default:''},
    phoneNum:{type:String,default:''},
    comments:{type:String,default:"什么都没有哦!~~"},
    data:{type:Date,default:Date.now},
    userpic:{type:String,default:"default.jpg"},
    group:{type:String,default:"0"},
    city:{type:String,default:''},
    userPasswordOne:String,
    userPasswordTwo:String,
    userPasswordThree:String
});
var User = mongoose.model('User',UserSchema);
module.exports = User;