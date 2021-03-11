const express=require('express');
const router=express.Router();

const catchAsync=require("../utils/catchAsync");
const ExpressError=require("../utils/ExpressError");

const Picnic=require('../models/picnic');

const {picnicSchema}=require("../schemas.js");

const validatePicnic=(req,res,next)=>{
    // not a mongoose schema but this will validate stuffs before saving to mongoose.
    const {error}=picnicSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

router.get("/",catchAsync(async(req,res)=>{
    const picnic_ground1=await Picnic.find({});
    res.render('picnic_ground/index',{picnic_ground1});
}));

router.get("/new",catchAsync(async(req,res)=>{        
    res.render("picnic_ground/new");
}));

router.post("/",validatePicnic,catchAsync(async(req,res,next)=>{
    // if(!req.body.picnic) throw new ExpressError("Invalid Picnic Ground Data",400);

    const new_model_variable=new Picnic(req.body.picnic);    
    await new_model_variable.save();       
    
    req.flash('success','Successfully made a new picnic ground !');

    res.redirect(`/picnic_ground/${new_model_variable._id}`);   
}));

// app.post("/picnic_ground",async(req,res,next)=>{
//     // res.send(req.body);     //we dont see anything it is empty bcz req.body is not parsed
//     // const picnic=new Picnic(req.body.picnic);     //creating model named picnic n saving in the existing model picnic
//     // await picnic.save();                             //saving it

//     //OORR

//     try{

//     const new_model_variable=new Picnic(req.body.picnic);     //creating model named picnic n saving in the existing model picnic
//     await new_model_variable.save();                             //saving it
//     res.redirect(`/picnic_ground/${new_model_variable._id}`);    //redirecting n getting the id.

//     }catch(e){
//         next(e);
//     }

// });

router.get("/:id",catchAsync(async(req,res)=>{
    const catch_id=await Picnic.findById(req.params.id).populate('reviews');
    // console.log(catch_id); just for checking
    res.render('picnic_ground/show',{catch_id});
}));

router.get("/:id/edit",catchAsync(async(req,res)=>{
    const catch_id=await Picnic.findById(req.params.id);
    res.render('picnic_ground/edit',{catch_id});
}));

router.put("/:id",catchAsync(async(req,res)=>{
    // res.send("It worked");
    const {id}=req.params;      //id is a object , that stores all req parameters. 
    const picnic3 = await Picnic.findByIdAndUpdate(id,{...req.body.picnic});   //spread operator when all the elements need to be included or brought here.
    res.redirect(`/picnic_ground/${picnic3._id}`);
}));

router.delete("/:id",catchAsync(async(req,res)=>{      //suffered 2 hrs because of incorrect path name next time pay attention
    // res.send("it worked");
    const {id}=req.params;
    await Picnic.findByIdAndDelete(id);
    res.redirect('/picnic_ground');
}));

module.exports=router;