const mongoose=require('mongoose');
const Picnic=require('../models/picnic');
const cities=require('./cities.js')   //involving cities js file.
const {places,descriptors}=require('./seedHelpers.js');
mongoose.connect('mongodb://localhost:27017/picnic-ly',{                //connect to database *** picnic-ly ***
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});      

const db=mongoose.connection;   //using db as shorthand notation for mongoose.connection.
db.on('error', console.error.bind(console,'connection error !: '));

db.once('open',()=>{
    console.log("Database connected");
})
//it will not work until u open in powershell and write mongod......  after it , it will work.

const sample=array=>array[Math.floor(Math.random()*array.length)];

const seedDB=async()=>{
    await Picnic.deleteMany({});
    // const c=new Picnic({title:'Purple field'});
    // await c.save();

    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const pic1 = new Picnic({
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:`https://source.unsplash.com/collection/190727/1600x900`,
            description:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, ea? Ut velit mollitia placeat! Hic minima inventore, exercitationem commodi esse cum? Dolorum dolorem inventore commodi!`,
            price:price
            // or no need just write =>  price
        })
        await pic1.save();
    }
    
};

seedDB().then(()=>{
    mongoose.connection.close();
});