const express=require('express');
const router=express.Router({mergeParams:true});    //necessary else it will not take id...while in picnic_ground we only have one param i.e picnic_ground

const catchAsync=require("../utils/catchAsync");
const ExpressError=require("../utils/ExpressError");

const Picnic=require('../models/picnic');
const Review=require("../models/review");

// const {reviewSchema}=require("../schemas.js");  //file moved so it is required there..

const { validateReview , isLoggedIn, isAuthor, isReviewAuthor} = require('../middleware');

const reviews = require("../controllers/reviews");

// const validateReview=(req,res,next)=>{   //moved to middleware.js
//     const {error}=reviewSchema.validate(req.body);
//     if(error){
//         const msg=error.details.map(el=>el.message).join(',')
//         throw new ExpressError(msg,400);
//     }else{
//         next();
//     }
// }

router.post("/",validateReview,isLoggedIn, catchAsync(reviews.createReview));

router.delete("/:reviewId",isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports=router;