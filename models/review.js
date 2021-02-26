const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    body:String,                //"Thsi is a great place"
    rating:Number               //5
});

module.exports=mongoose.model("Review",reviewSchema);