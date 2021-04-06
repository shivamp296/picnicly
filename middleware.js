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
