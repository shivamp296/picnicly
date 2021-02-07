const mongoose=require('mongoose');
const Schema=mongoose.Schema;   //no need of writing mongoose.Schema everytime instead jst write Schema

const classinfo=new Schema({
    name: String,
    year: String,
    subject: String,
    type: String,   //resources or announcement
    description_title: String,   //description of that subject
    text: String
});

module.exports=mongoose.model('classroom',classinfo); //make available outside