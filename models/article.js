/**
 * Created by Administrator on 2016/12/30.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var aaaSchema = new Schema({
    _id:{
        type:String,
        unique:true,
        'default':shortid.generate
    },
    email:{type:String,default : ''},
    time:{type: String, default: '' },
    author:{type:String,default : 'AdminUser'},
    authorpic:{type:String,default : 'default.jpg'},
    title:{type:String,default:"什么都没有哦!~~"},
    message:{type:String,default:"用户并没有描述~~"},
    date: { type: Date, default: Date.now },
    selection:{type:String,default:"未定义"},
    pv:{type:Number,default:"0"},
    tags:{type:String,default:""},
    updateDate: { type: Date, default: Date.now }, // 更新时间
    comments:[],
    // comments:{commentNum : { type: Number, default: 0 },content:{type:String,default:''},name:{type:String,ref : 'AdminUser'},date: { type: Date, default: Date.now }},
    like : {likeNum:{ type: Number, default: 0 },name:{type:String,ref : 'AdminUser'}},

    isTop : { type: Number, default: 0 },
});
var Article = mongoose.model('Article',aaaSchema);
module.exports = Article;


