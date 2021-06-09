const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    body:String,                //"Thsi is a great place"
    rating:Number,               //5
    author: {
        type:Schema.Types.ObjectId, //take id as a type 
        ref:"User"  //take reference from Review Model.
    },
});

module.exports=mongoose.model("Review",reviewSchema);