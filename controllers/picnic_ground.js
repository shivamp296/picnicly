const Picnic=require('../models/picnic');

module.exports.index = async(req,res)=>{
    const picnic_ground1=await Picnic.find({});
    res.render('picnic_ground/index',{picnic_ground1});
}

module.exports.renderNewForm = async(req,res)=>{    
    //else write here if statement middleware

        // if(!req.isAuthenticated()){
        //     req.flash("error","You must be signed in first");
        //     return res.redirect("/login");
        // }

    res.render("picnic_ground/new");
}

module.exports.createPicnicGround = async(req,res,next)=>{
    // if(!req.body.picnic) throw new ExpressError("Invalid Picnic Ground Data",400);

    const new_model_variable=new Picnic(req.body.picnic);  
    new_model_variable.author = req.user._id;  
    await new_model_variable.save();       
    
    req.flash('success','Successfully made a new picnic ground !');

    res.redirect(`/picnic_ground/${new_model_variable._id}`);   
}

module.exports.showPicnicGround = async(req,res)=>{
    // const catch_id=await Picnic.findById(req.params.id).populate('reviews').populate('author'); i needed that hrr ek review kaa author populate ho...
    const catch_id=await Picnic.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    // console.log(catch_id); //just for checking

    if(!catch_id){
        req.flash('error','Cannot find that picnic spot u entered !');
        return res.redirect("/picnic_ground");
    }
    res.render('picnic_ground/show',{catch_id});

}

module.exports.renderEditForm = async(req,res)=>{
    const {id}=req.params;
    const catch_id=await Picnic.findById(id);
    
    if(!catch_id){
        req.flash('error','Cannot find that picnic spot u entered !');
        return res.redirect("/picnic_ground");
    }

    
    //isAuthor

    // if(!catch_id.author.equals(req.user._id)){
    //     req.flash('error',"You don't have permission to do that");
    //     return res.redirect(`/picnic_ground/${id}`);
    // }

    res.render('picnic_ground/edit',{catch_id});
}

module.exports.updatePicnicGround = async(req,res)=>{
    // res.send("It worked");
    const {id}=req.params;      //id is a object , that stores all req parameters. 
    const picnic3 = await Picnic.findById(id);

    //i have created a middleware for it..

    // if(!picnic3.author.equals(req.user._id)){
    //     req.flash('error',"You don't have permission to do that");
    //     return res.redirect(`/picnic_ground/${id}`);
    // }

    const picnic4 = await Picnic.findByIdAndUpdate(id,{...req.body.picnic});   //spread operator when all the elements need to be included or brought here. //picnic4 variable main store hai.. kaam aayegaa toh dekh lenge..
    req.flash('success',"Successfully updated the picnic ground u entered !");
    res.redirect(`/picnic_ground/${picnic3._id}`);
}

module.exports.deletePicnicGround = async(req,res)=>{      //suffered 2 hrs because of incorrect path name next time pay attention
    // res.send("it worked");
    const {id}=req.params;

    await Picnic.findByIdAndDelete(id);
    req.flash("success","Successfully deleted a picnic ground");
    res.redirect('/picnic_ground');
}



