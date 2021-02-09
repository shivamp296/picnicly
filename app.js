const express=require("express");
const path=require("path");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const mongoose=require('mongoose');

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


app.get("/",(req,res)=>{
    res.render('home');
})

app.get("/picnic_ground",async(req,res)=>{
    const picnic_ground1=await Picnic.find({});
    res.render('picnic_ground/index',{picnic_ground1});
})

app.get("/picnic_ground/new",(req,res)=>{        
    res.render("picnic_ground/new");
})

app.post("/picnic_ground",async(req,res)=>{
    // res.send(req.body);     //we dont see anything it is empty bcz req.body is not parsed
    // const picnic=new Picnic(req.body.picnic);     //creating model named picnic n saving in the existing model picnic
    // await picnic.save();                             //saving it

    //OORR

    const new_model_variable=new Picnic(req.body.picnic);     //creating model named picnic n saving in the existing model picnic
    await new_model_variable.save();                             //saving it
    res.redirect(`/picnic_ground/${new_model_variable._id}`);    //redirecting n getting the id.
});

app.get("/picnic_ground/:id",async(req,res)=>{
    const catch_id=await Picnic.findById(req.params.id);
    res.render('picnic_ground/show',{catch_id});
});

app.get("/picnic_ground/:id/edit",async(req,res)=>{
    const catch_id=await Picnic.findById(req.params.id);
    res.render('picnic_ground/edit',{catch_id});
});

app.put("/picnic_ground/:id",async(req,res)=>{
    // res.send("It worked");
    const {id}=req.params;      //id is a object , that stores all req parameters. 
    const picnic3 = await Picnic.findByIdAndUpdate(id,{...req.body.picnic});   //spread operator when all the elements need to be included or brought here.
    res.redirect(`/picnic_ground/${picnic3._id}`);
});

app.delete("/picnic_ground/:id",async(req,res)=>{      //suffered 2 hrs because of incorrect path name next time pay attention
    // res.send("it worked");
    const {id}=req.params;
    await Picnic.findByIdAndDelete(id);
    res.redirect('/picnic_ground');
});


// app.get("/picnic_ground/new",(req,res)=>{        Write above id, because new will be treated  as :id
//     res.render("picnic_ground/new");
// })

app.listen(3001,()=>{
    console.log("Listening on the port : 3001");
});