const express=require('express');
const router=express.Router({mergeParams:true});    //necessary else it will not take id...while in picnic_ground we only have one param i.e picnic_ground

const catchAsync=require("../utils/catchAsync");
const ExpressError=require("../utils/ExpressError");

const Picnic=require('../models/picnic');
const Review=require("../models/review");

const {reviewSchema}=require("../schemas.js");

const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

router.post("/",validateReview, catchAsync(async(req,res)=>{
    // res.send("You made it !");  
    const picnic=await Picnic.findById(req.params.id);

    const review=new Review(req.body.review);           //yeh jo review hai woh array hai jo humne form main use kiya tha...
    //  .......req.....se body uthao......body se review array uthao.....
    picnic.reviews.push(review);    //picnic model ke andrr kaa reviews field main push krro review array ko...
    await review.save();  //save it...
    await picnic.save();  //save model..

    req.flash("success","Created a new review !");

    res.redirect(`/picnic_ground/${picnic._id}`)

}));

router.delete("/:reviewId",catchAsync(async(req,res)=>{
    const {id,reviewId}=req.params;

    Picnic.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});        //we have to delete from picic too.. not all ..but a particular one so we have used $pull that pull out from array
    await Review.findByIdAndDelete(reviewId);
    // res.send("Delete me");

    req.flash("success","Successfully deleted a review");

    res.redirect(`/picnic_ground/${id}`);

}));

module.exports=router;