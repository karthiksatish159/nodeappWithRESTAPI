const express=require('express');
const router=express.Router();
const jsonwt=require('jsonwebtoken');
const passport=require('passport');
const mongoose=require("mongoose");
const bycrpyt=require('bcryptjs');
const key=require("../../setup/myUrl");
router.get('/',(req,res)=>{
    res.json({text:"Auth is success"})
});
//@Type Post
//@route /api/auth/register
//@Desc route for register
//@access PUBLIC
const Person=require("../../models/Person");
router.post("/register",(req,res)=>{
    Person.findOne({email:req.body.email})
    //The reason why we are using findOne function is we are not allowing the user already registered
    //So here below line person is an object which coming from your mongoDb database so here if person exist we through an error or else we can that user
    .then(person=>
        { if(person)
            {
                return res.status(400).json({emailerror:"This email is already registered"});
            }
            else{
                const newPerson=new Person({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                    //so here we created the user but we have to save the user but before that we have to encrypt the password using bycryptjs 
                });
                //Encrypt the password using bcrypt
                bycrpyt.genSalt(10,(err,salt)=>{
                    bycrpyt.hash(newPerson.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newPerson.password=hash;
                        newPerson
                        .save()
                        .then(person=>res.json(person))
                        .catch(err=>console.log(err));
                    })
                })
            }

    })
    .catch(err=>console.log(err));

//@Type Post
//@route /api/auth/login
//@Desc route for login and authentication of the user data
//@access PUBLIC
router.post("/login",(req,res)=>
{
    const email=req.body.email;
    const password=req.body.password;
    Person.findOne({email})
     .then(person=>{
         if(!person)
         {
            res.status(400).json({usererror:"This user is not existed please register"});
         }
         else
         {
             bycrpyt.compare(password,person.password)
             .then(isCompare=>{
                 if(isCompare)
                 {
                    //  res.json({success:"Successfully logined"});
                    // so here we are creating a payload when ever a user logined successfully we are generating a token
                    //For that token body we have to pass a payload with ntg but your information used for authorization
                    const payload={
                        id:person.id,
                        email:person.email,
                    };
                    jsonwt.sign(
                        payload,
                        key.secreat,
                        {expiresIn:3600},
                        (err,token)=>{
                            if(err)
                            {
                                throw err;
                            }
                            else
                            {
                                res.json({
                                    success:true,
                                    token:"Bearer "+token
                                })
                            }
                        }
                        )
                 }
                 else
                 {
                     res.json({fail:"Worng password"});
                 }
             })
             .catch(err=>console.log(err));
         }
     })
     .catch(err=>console.log(err));
})


})
//@Type GET
//@route /api/auth/profile
//@Desc route for profile
//@access PRIVATE
console.log("Calling middleware")
router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res)=>
{
    console.log("Auth");
  res.json({id:req.user.id,
            email:req.user.email
        }) 
})
module.exports=router;