module.exports.isLoggedIn=(req,res,next)=>{
    // console.log("req.user...",req.user); give details of current user
    if(!req.isAuthenticated()){
        req.flash("error","You must be signed in first");
        return res.redirect("/login");
    }
    next();
}
