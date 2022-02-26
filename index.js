const express=require('express');
const app=express();
const bodyparser=require('body-parser');
const port123=process.env.PORT||3000;
const mongoose=require("mongoose");
//So here we are grabing the url of connection
//So that url will save into the db varible
const db=require('./setup/myUrl').mongoDbUrl;
//bring all routes
const auth=require('./routes/api/auth');
const profile=require('./routes/api/profile');
const questions=require('./routes/api/questions');
const passport = require('passport');
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
//So here we are connecting to our database of mongoDb
//then() and catch() are similar to the try and catch 



// mongoose.connect(db,{useNewUrlParser:true})
// mongoose
// .connection
// .once("open",()=>console.log("success"))
// .on("error",error=>{
//     console.log("your error",error);
// })

//Attempt to connect the database
mongoose
.connect(db)
.then(()=>console.log("database is succefully created"))
.catch(err=>console.log(err));

//This is testing route
app.get("/",(req,res)=>{
    res.send("Hello Big stack");
})
console.log("Calling passport");
//passport middleware
//So when ever we are using strategies then we need to initialize the passport,Because it will run them when ever we request the route
app.use(passport.initialize());

//getting the strategy
require('./strategies/jwtStrategy')(passport);
console.log("Pass");
//These are the actual routes
//So here we are writing our routes in seperate file and we call those routes via middleware 
//So here first parameter is a route and the second parameter calls the auth.js file in that we have route it will give and accept response and request
//So firstly these middleares are getting exctuded
app.use('/api/auth',auth);

//This route is for profile
app.use('/api/profile',profile);
//This route is for quesitions
app.use('/api/questions',questions);

app.listen(port123,()=>console.log(`Server is running on ${port123}`));