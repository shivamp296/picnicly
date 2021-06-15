const express=require('express');
const router=express.Router();

const catchAsync=require("../utils/catchAsync");
// const ExpressError=require("../utils/ExpressError");    //since we moved middleware so this is required in middleware,js

const Picnic=require('../models/picnic');

// const {picnicSchema}=require("../schemas.js");   //since we moved middleware so this is required in middleware,js
const {isLoggedIn,isAuthor,validatePicnic}=require("../middleware");

//controllers
const picnic_ground = require("../controllers/picnic_ground");

//multer
var multer  = require('multer')
var upload = multer({ dest: './public/data/uploads/' })
// Moving this in a middleware file...

// const validatePicnic=(req,res,next)=>{
//     // not a mongoose schema but this will validate stuffs before saving to mongoose.
//     const {error}=picnicSchema.validate(req.body);
//     if(error){
//         const msg=error.details.map(el=>el.message).join(',')
//         throw new ExpressError(msg,400);
//     }else{
//         next();
//     }
// }

// //middleware
// const isAuthor = async(req,res,next)=>{
//     const {id}=req.params;      //id is a object , that stores all req parameters. 
//     const picnic3 = await Picnic.findById(id);
//     if(!picnic3.author.equals(req.user._id)){
//         req.flash('error',"You don't have permission to do that");
//         return res.redirect(`/picnic_ground/${id}`);
//     }
//     next(); 
// }

// router.get("/",catchAsync(async(req,res)=>{  //Moving this all in controllers...
//     const picnic_ground1=await Picnic.find({});
//     res.render('picnic_ground/index',{picnic_ground1});
// }));

//fancy way of structuring

router.route("/")
    .get(catchAsync(picnic_ground.index))
    // .post(isLoggedIn,validatePicnic,catchAsync(picnic_ground.createPicnicGround))
    .post(upload.single('image'),(req,res)=>{
        res.send(req.body,req.file);    //res.send doesnt support req.body
    })
// router.get("/",catchAsync(picnic_ground.index));

router.get("/new",isLoggedIn,catchAsync(picnic_ground.renderNewForm));

// router.post("/",isLoggedIn,validatePicnic,catchAsync(picnic_ground.createPicnicGround));


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

router.route("/:id")
    .get(catchAsync(picnic_ground.showPicnicGround))
    .put(isLoggedIn,isAuthor,validatePicnic,catchAsync(picnic_ground.updatePicnicGround))
    .delete(isLoggedIn,isAuthor,catchAsync(picnic_ground.deletePicnicGround));

// router.get("/:id",catchAsync(picnic_ground.showPicnicGround));

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(picnic_ground.renderEditForm));

// router.put("/:id",isLoggedIn,isAuthor,validatePicnic,catchAsync(picnic_ground.updatePicnicGround));

// router.delete("/:id",isLoggedIn,isAuthor,catchAsync(picnic_ground.deletePicnicGround));

module.exports=router;