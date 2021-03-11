const express=require("express");
const path=require("path");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
// method-override mtlab --- hrr chigg post main hi krrun.. but ?_method="DELETE" se rename krrke usko delete route bnaa dun..
const mongoose=require('mongoose');
const catchAsync=require("./utils/catchAsync");
const ExpressError=require("./utils/ExpressError");
const Review=require("./models/review");
// const Joi = require("joi");
const {picnicSchema,reviewSchema}=require("./schemas.js");

const Picnic=require('./models/picnic');

const picnic_ground=require('./routes/picnic_ground');

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

const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}


app.use("/picnic_ground",picnic_ground);    //useful in breaking down routes.

app.get("/",(req,res)=>{
    res.render('home');
})

//adding catchAsync() function to handles errors.



app.post("/picnic_ground/:id/reviews",validateReview, catchAsync(async(req,res)=>{
    // res.send("You made it !");  
    const picnic=await Picnic.findById(req.params.id);

    const review=new Review(req.body.review);           //yeh jo review hai woh array hai jo humne form main use kiya tha...
    //  .......req.....se body uthao......body se review array uthao.....
    picnic.reviews.push(review);    //picnic model ke andrr kaa reviews field main push krro review array ko...
    await review.save();  //save it...
    await picnic.save();  //save model..
    res.redirect(`/picnic_ground/${picnic._id}`)

}));

app.delete("/picnic_ground/:id/reviews/:reviewId",catchAsync(async(req,res)=>{
    const {id,reviewId}=req.params;

    Picnic.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});        //we have to delete from picic too.. not all ..but a particular one so we have used $pull that pull out from array
    await Review.findByIdAndDelete(reviewId);
    // res.send("Delete me");
    res.redirect(`/picnic_ground/${id}`);

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

app.listen(3000,()=>{
    console.log("Listening on the port : 3000");
});