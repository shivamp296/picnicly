if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express=require("express");
const path=require("path");
//for path..
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
// method-override mtlab --- hrr chigg post main hi krrun.. but ?_method="DELETE" se rename krrke usko delete route bnaa dun..
const mongoose=require('mongoose');
// const catchAsync=require("./utils/catchAsync");

const ExpressError=require("./utils/ExpressError");
const Review=require("./models/review");
// const Joi = require("joi");
// const {picnicSchema,reviewSchema}=require("./schemas.js");

const mongoSanitize = require('express-mongo-sanitize');

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");

const session=require('express-session');
const flash=require('connect-flash');

const Picnic=require('./models/picnic');

const picnic_groundRoutes=require('./routes/picnic_ground');      //necessary for breakouts
const reviewsRoutes=require('./routes/reviews');                  //necessary for breakouts
const userRoutes=require("./routes/users");
const helmet = require('helmet');

const MongoDBStore = require('connect-mongodb-session')(session);

const dbUrl='mongodb://localhost:27017/picnic-ly';
mongoose.connect(dbUrl,{    //connect to database *** picnic-ly ***
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
// app.use(express.static('public'));  //telling our app to serve public directory
app.use(express.static(path.join(__dirname,'public')));  //telling our app to serve public directory
// To remove data, use:
app.use(mongoSanitize({
    replaceWith: '_',
}
));

const store = new MongoDBStore({
    url: dbUrl,
    secret:'thisshouldbeabettersecret!',
    touchAfter: 24*60*60,
});

store.on("error",function(e){
    console.log("SESSION STORE EROR",e);
});

const sessionConfig={
    store,
    name:"session",
    secret:'thisshouldbeabettersecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires: Date.now() + 1000*60*60*24*7,  //present date se 7 days tkk...
        maxAge: 1000*60*60*24*7                 //max 7 days time in milli-seconds
    }
}
app.use(session(sessionConfig));
app.use(flash());



//I have to fix it....

// app.use(helmet({contentSecurityPolicy:false}));

// app.use(helmet());


// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com",
//     "https://api.tiles.mapbox.com",
//     "https://api.mapbox.com",
//     "https://kit.fontawesome.com",
//     "https://cdnjs.cloudflare.com",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com",
//     "https://stackpath.bootstrapcdn.com",
//     "https://api.mapbox.com",
//     "https://api.tiles.mapbox.com",
//     "https://fonts.googleapis.com",
//     "https://use.fontawesome.com",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com",
//     "https://*.tiles.mapbox.com",
//     "https://events.mapbox.com",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             childSrc: ["blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/psaber29/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );


// const validateReview=(req,res,next)=>{
//     const {error}=reviewSchema.validate(req.body);
//     if(error){
//         const msg=error.details.map(el=>el.message).join(',')
//         throw new ExpressError(msg,400);
//     }else{
//         next();
//     }
// }


// const validateReview=(req,res,next)=>{
//     const {error}=reviewSchema.validate(req.body);
//     if(error){
//         const msg=error.details.map(el=>el.message).join(',')
//         throw new ExpressError(msg,400);
//     }else{
//         next();
//     }
// }

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    // console.log(req.session);
    res.locals.currentUser=req.user;    //middleware that everytime it checks for current user by this we can hide register n login
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
});

app.get("/fakeuser",async(req,res)=>{
    const user=new User({email:"colt@gmail.com",username:"colttt"});
    const newUser=await User.register(user,"chicken");
    res.send(newUser);
});

app.use("/picnic_ground",picnic_groundRoutes);    //useful in breaking down  picnic_ground routes.
app.use("/picnic_ground/:id/reviews",reviewsRoutes);    //useful in breaking down reviews routes.
app.use("/",userRoutes);    //useful in breaking down reviews routes.

app.get("/",(req,res)=>{
    res.render('home');
})

//adding catchAsync() function to handles errors.



// app.post("/picnic_ground/:id/reviews",validateReview, catchAsync(async(req,res)=>{
//     // res.send("You made it !");  
//     const picnic=await Picnic.findById(req.params.id);

//     const review=new Review(req.body.review);           //yeh jo review hai woh array hai jo humne form main use kiya tha...
//     //  .......req.....se body uthao......body se review array uthao.....
//     picnic.reviews.push(review);    //picnic model ke andrr kaa reviews field main push krro review array ko...
//     await review.save();  //save it...
//     await picnic.save();  //save model..
//     res.redirect(`/picnic_ground/${picnic._id}`)

// }));

// app.delete("/picnic_ground/:id/reviews/:reviewId",catchAsync(async(req,res)=>{
//     const {id,reviewId}=req.params;

//     Picnic.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});        //we have to delete from picic too.. not all ..but a particular one so we have used $pull that pull out from array
//     await Review.findByIdAndDelete(reviewId);
//     // res.send("Delete me");
//     res.redirect(`/picnic_ground/${id}`);

// }));

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