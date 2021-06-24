const mongoose=require('mongoose');
const Schema=mongoose.Schema;   //no need of writing mongoose.Schema everytime instead jst write Schema
const Review=require("./review");

const ImageSchema = new Schema({
    url: String,
    filename: String
})

const PicnicSchema=new Schema({
    title: String,
    image: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type:Schema.Types.ObjectId, //take id as a type 
        ref:"User"  //take reference from Review Model.
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,      //take id as a type 
            ref:"Review"                       //take reference from Review Model.
        }
    ]
});

// mongoose middleware.

// PicnicSchema.post("findOneAndDelete",async function(){
//     // console.log("Deleted (For checking purpose)");
// });
PicnicSchema.post("findOneAndDelete",async function(docsx){
    // console.log(docsx);
    if(docsx){
        await Review.deleteMany({
            _id:{
                $in: docsx.reviews        //where id is in docsx.reviews  means deleted once.
            }
        })
    }
});
module.exports=mongoose.model('picnic',PicnicSchema); //make available outside