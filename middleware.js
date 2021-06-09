const {picnicSchema,reviewSchema}=require("./schemas.js");
const ExpressError=require("./utils/ExpressError");
const Picnic=require('./models/picnic');
const Review=require("./models/review");
// const {reviewSchema}=require("./schemas.js");

module.exports.isLoggedIn=(req,res,next)=>{
    // console.log("req.user...",req.user); give details of current user

    //here wherever we r , after login sucessfully we r only redirecting to picnic_ground page...we want that we remain in same page
    if(!req.isAuthenticated()){
        //store the url they r requesting
        // console.log(req.path,req.originalUrl);

        // req.path - gives url /new
        // req.originalUrl - gives url /picnic_ground/new

        req.session.returnTo=req.originalUrl;
        req.flash("error","You must be signed in first");
        return res.redirect("/login");
    }
    next();
}

module.exports.validatePicnic=(req,res,next)=>{
    // not a mongoose schema but this will validate stuffs before saving to mongoose.
    const {error}=picnicSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

//middleware
module.exports.isAuthor = async(req,res,next)=>{
    const {id}=req.params;      //id is a object , that stores all req parameters. 
    const picnic3 = await Picnic.findById(id);
    if(!picnic3.author.equals(req.user._id)){
        req.flash('error',"You don't have permission to do that");
        return res.redirect(`/picnic_ground/${id}`);
    }
    next(); 
}

//middleware
module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId}=req.params;      //id is a object , that stores all req parameters. 
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error',"You don't have permission to do that");
        return res.redirect(`/picnic_ground/${id}`);
    }
    next(); 
}

module.exports.validateReview=(req,res,next)=>{
        const {error}=reviewSchema.validate(req.body);
        if(error){
            const msg=error.details.map(el=>el.message).join(',')
            throw new ExpressError(msg,400);
        }else{
            next();
        }
    }
