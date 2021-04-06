const express= require('express');
const router=express.Router();
const catchAsync=require("../utils/catchAsync")
const User=require("../models/user");
const passport=require("passport");

router.get("/register",(req,res)=>{
    res.render("users/register");
});
router.post("/register",catchAsync(async(req,res,next)=>{
    // res.send(req.body);
    try{
    const {email,username,password}=req.body;
    const user=new User({email,username});
    const registeredUser=await User.register(user,password);
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
        res.redirect("register");
    }
    // console.log(registeredUser);  
}));

router.get("/login",(req,res)=>{
    res.render("users/login");
});

router.post("/login",passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),(req,res)=>{
    req.flash("success","Welcome back !");
    res.redirect("/picnic_ground");
});

router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Goodbye u r logged out !");
    res.redirect("/picnic_ground");
})


module.exports=router;