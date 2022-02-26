const express = require("express");
const router=express.Router();
const mongoose=require("mongoose");
const passport=require("passport");
const Person=require("../../models/Person");
const Profile=require("../../models/Profile");
//@Type GET
//@route /api/profile
//@Desc route for to get profile for user
//@access PRIVATE
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>
{
   Profile.findOne({user:req.user.id})
   .then(profile=>{
       if(!profile)
       {
           res.status(404).json({profileerror:"profile is not exist for this user"});
       }
       else
       {
           res.json({success:profile});
       }
   })
   .catch(err=>console.log(err));
});
//@Type POST
//@route /api/profile
//@Desc route for to So if the user not exist a profile or if he exist but he wanted to update the  deatials then this below route will called
//@access PRIVATE
router.post('/',passport.authenticate('jwt',{session:false}),
(req,res)=>
{
   let profileValues={};
    profileValues.user=req.user.id
    if(req.body.username)
        profileValues.username=req.body.username
    if(req.body.website)
        profileValues.website=req.body.website
    if(req.body.country)
        profileValues.country=req.body.country
    if(typeof req.body.languages!==undefined)
            profileValues.languages=req.body.languages.split(",");
    if(req.body.portfolio)
        profileValues.portfolio=req.body.portfolio
    //get social link
    profileValues.social={};
    if(req.body.youtube)
        profileValues.social.youtube=req.body.youtube
    if(req.body.instagram)
        profileValues.social.instagram=req.body.instagram
    if(req.body.facebook)
        profileValues.social.facebook=req.body.facebook
    //Do database stuff
    Profile.findOne({user:profileValues.user})
    .then(person=>{
        if(person)
        {
            //So if the person exist in database we are doing the update operation
            Profile.findOneAndUpdate({user:profileValues.user},{$set:profileValues},{new:true})
            .then(profile=>res.status(200).json(profile))
            .catch(err=>console.log(err))
        }
        else
        {
            //If the user was does not exist means we have to create the profile for the user 
            //Before that we have to check the username is already existed or not
            Profile.findOne({username:profileValues.username})
            .then(person=>{
                if(person)
                {
                    res.status(400).json({error:"This username is already existed"})
                }
                else
                {
                    //We are creating the user
                    new Profile(profileValues)
                    .save()
                    .then(person=>res.json({profilecreated:person}))
                    .catch(err=>console.log(err));
                }
            })
            .catch(err=>console.log(err))
        }
    })
    .catch(err=>console.log(err));
})
//@Type GET
//@route /api/profile/:useraname
//@Desc route for to give the user data in public 
//@access PUBLIC

router.get('/:username',(req,res)=>{
    Profile.findOne({username:req.params.username})
    //So here populate method is equvilient to the joins concept the first param is the reference of that collection and second param will grab those fields from that collection
    //Second parameter is optional and if passed only the first one you will get all the values
    .populate('user',['name','profilepic'])
    .then(person=>{
        if(person)
        {
            res.status(200).json(person);
        }
        else
        {
            res.status(404).json({error:"The profile is not existed"});
        }
    })
    .catch(err=>console.log(err));
})
//@Type GET
//@route /api/profile/:id
//@Desc route for to give the user data in public via id
//@access PUBLIC
router.get("/id/:id",(req,res)=>{
    Profile.findOne({id:req.params.id})
    .populate('user')
    .then(person=>{
        if(person)
        {
            res.json(person);
        }
        else
        {
            res.status(404).json({iderror:"id does not exist"});
        }
    })
    .catch(err=>console.log(err));
});
//@Type GET
//@route /api/profile/everyone
//@Desc route for to give the user data in public 
//@access PUBLIC

router.get('/find/everyone',(req,res)=>{
    Profile.find()
    .populate('user',['name','profilepic'])
    .then(person=>{
        if(person)
        {
            res.status(200).json(person);
        }
        else
        {
            res.status(404).json({error:"The profile is not existed"});
        }
    })
    .catch(err=>console.log(err));
})
//@Type DELETE
//@route /api/profile/
//@Desc route for to delete the user you have logineed based on that id we are deleting here without any params
//@access PRIVATE
router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
        Profile.findOneAndRemove({user:req.user.id})
        .then((person)=>
        {
                if(person)
                {
                    Person.findOneAndRemove({_id:req.user.id})
                    .then(res.json({success:"The user removed successfully"}))
                    .catch(err=>console.log(err))
                }
                else
                {
                    res.status(404).json({user:"User not found"})
                }
        })
        .catch(err=>console.log(err));
});
//@Type POST
//@route /api/profile/workrole
//@Desc route for to workrole array
//@access PRIVATE
router.post('/workrole',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        if(profile)
        {
            const WorkObj=
            {
                role:req.body.role,
                company:req.body.company,
                country:req.user.country,
                from:req.body.from,
                to:req.body.to,
                current:req.body.current,
                details:req.body.details
            }
            profile.workrole.push(WorkObj)
            profile
            .save()
            .then(person=>res.json(person))
            .catch(err=>console.log(err));
            
        }
        else
        {
            res.status(404).json({error:"User not found"});
        }
    })
    .catch(err=>console.log(err));
   

});
//@Type DELETE
//@route /api/profile/workrole/:w_id
//@Desc route for delete the workrole
//@access PRIVATE
router.delete('/workrole/:w_id',passport.authenticate('jwt',{session:false}),(req,res)=>
{
    Profile.findOne({user:req.user.id})
    .then(person=>
        {
            if(person)
            {
                const removeThis=person.workrole.map(ele=>ele.id).indexOf(req.params.w_id);
                person.workrole.splice(removeThis,1);
                person.save()
                .then(p=>res.json(p))
                .catch(err=>console.log(err))
            }
            else
            {
                res.status(404).json({error:"User is not found"});
            }
    })
    .catch(err=>console.log(err));
});
module.exports=router;