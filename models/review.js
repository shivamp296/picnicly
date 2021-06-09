const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    body:String,                //"Thsi is a great place"
    rating:Number,               //5
    author:{                    //rating kon diyaa hai..ye ptaa lg jaaegaa
        type:Schema.Types.ObjectId,
        ref:'User',
    }
});

module.exports=mongoose.model("Review",reviewSchema);