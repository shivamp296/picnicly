const User = require("../models/user");

module.exports.renderRegister = (req,res)=>{
    res.render("users/register");
}

module.exports.register = async(req,res,next)=>{
    // res.send(req.body);
    try{
    // console.log("Im here1");
    const {email,username,password}=req.body;
    // console.log("Im here1.2");
    // console.log(email);
    // console.log(username);
    // console.log(password);
    const user=new User({email,username});
    // console.log(user);
    // console.log("Im here1.3");
    const registeredUser=await User.register(user,password);
    // console.log("Im here2");
    //after registeration we want the user should be automatcally logged in... no need to login once again
    req.login(registeredUser,err=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to picnicly");
        res.redirect("/picnic_ground");
    })
    
    }catch(e){
        req.flash("error",e.message);
        // console.log("Im here3");
        res.redirect("register");
    }
    // console.log(registeredUser);  
}

module.exports.renderLogin = (req,res)=>{
    res.render("users/login");
}

module.exports.login = (req,res)=>{

    req.flash("success","Welcome back !");
    const redirectUrl=req.session.returnTo || "/picnic_ground"; //redirecting to the current page
    delete req.session.returnTo //after storing in redirectUrl no need of storring unnecessary session
    res.redirect(redirectUrl);

}

module.exports.logout = (req,res)=>{
    req.logout();
    req.flash("success","Goodbye u r logged out !");
    res.redirect("/picnic_ground");
}
