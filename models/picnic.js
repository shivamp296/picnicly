const mongoose=require('mongoose');
const Schema=mongoose.Schema;   //no need of writing mongoose.Schema everytime instead jst write Schema

const PicnicSchema=new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports=mongoose.model('picnic',PicnicSchema); //make available outside