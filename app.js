const express=require("express");
const path=require("path");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const mongoose=require('mongoose');
const catchAsync=require("./utils/catchAsync");
const ExpressError=require("./utils/ExpressError");
const Review=require("./models/review");
// const Joi = require("joi");
const {picnicSchema,reviewSchema}=require("./schemas.js");

const Picnic=require('./models/picnic');

mongoose.connect('mongodb://localhost:27017/picnic-ly',{    //connect to database *** picnic-ly ***
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false   //imp to set for findAndUpdate
});      

const db=mongoose.connection;   //using db as shorthand notation for mongoose.connection.
db.on('error', console.error.bind(console,'connection error !: '));

db.once('open',()=>{
    console.log("Database connected");
})
//it will not work until u open in powershell and write mongod......  after it , it will work.

const app=express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

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

app.get("/",(req,res)=>{
    res.render('home');
})

//adding catchAsync() function to handles errors.

app.get("/picnic_ground",catchAsync(async(req,res)=>{
    const picnic_ground1=await Picnic.find({});
    res.render('picnic_ground/index',{picnic_ground1});
}));

app.get("/picnic_ground/new",catchAsync(async(req,res)=>{        
    res.render("picnic_ground/new");
}));

app.post("/picnic_ground",validatePicnic,catchAsync(async(req,res,next)=>{
    // if(!req.body.picnic) throw new ExpressError("Invalid Picnic Ground Data",400);

    const new_model_variable=new Picnic(req.body.picnic);    
    await new_model_variable.save();                           
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

app.get("/picnic_ground/:id",catchAsync(async(req,res)=>{
    const catch_id=await Picnic.findById(req.params.id);
    res.render('picnic_ground/show',{catch_id});
}));

app.get("/picnic_ground/:id/edit",catchAsync(async(req,res)=>{
    const catch_id=await Picnic.findById(req.params.id);
    res.render('picnic_ground/edit',{catch_id});
}));

app.put("/picnic_ground/:id",catchAsync(async(req,res)=>{
    // res.send("It worked");
    const {id}=req.params;      //id is a object , that stores all req parameters. 
    const picnic3 = await Picnic.findByIdAndUpdate(id,{...req.body.picnic});   //spread operator when all the elements need to be included or brought here.
    res.redirect(`/picnic_ground/${picnic3._id}`);
}));

app.delete("/picnic_ground/:id",catchAsync(async(req,res)=>{      //suffered 2 hrs because of incorrect path name next time pay attention
    // res.send("it worked");
    const {id}=req.params;
    await Picnic.findByIdAndDelete(id);
    res.redirect('/picnic_ground');
}));

app.post("/picnic_ground/:id/reviews",catchAsync(async(req,res)=>{
    // res.send("You made it !");  
    const picnic=await Picnic.findById(req.params.id);

    const review=new Review(req.body.review);           //yeh jo review hai woh array hai jo humne form main use kiya tha...
    //  .......req.....se body uthao......body se review array uthao.....
    picnic.reviews.push(review);    //picnic model ke andrr kaa reviews field main push krro review array ko...
    await review.save();  //save it...
    await picnic.save();  //save model..
    res.redirect(`/picnic_ground/${picnic._id}`)

}));

//for something that didn't exist, it should be written at end
// app.all("*",(req,res)=>{
//    res.send("404 !!! "); 
// });
app.all("*",(req,res,next)=>{
//    res.send("404 !!! "); 
    next(new ExpressError("Page not found !",404));
});

// app.get("/picnic_ground/new",(req,res)=>{        Write above id, because new will be treated  as :id
//     res.render("picnic_ground/new");
// })

app.use((err,req,res,next)=>{
    // res.send("Oh boy something went wrong!!");
    const {statusCode=500}= err;
    if(!err.message) err.message='Oh no! Something went wrong !';
    // res.status(statusCode).send(message);
    res.status(statusCode).render('errors',{err});
});

app.listen(3001,()=>{
    console.log("Listening on the port : 3001");
});