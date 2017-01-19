/**
 * Created by Administrator on 2017/1/3.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var BookShop = new Schema({
    _id:{
        type:String,
        unique:true,
        'default':shortid.generate
    },
    title:String,
    content:String,
    lessom:String,
    grade:String,
    author:String,
    conmments:[]

})
var Book = mongoose.model('Book',BookShop);
module.exports = Book;