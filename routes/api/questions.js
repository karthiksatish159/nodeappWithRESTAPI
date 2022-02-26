const express = require("express");
const passport = require("passport");
const router=express.Router();
const Person=require("../../models/Person");
const Profile=require("../../models/Profile");
const Question=require("../../models/Question");

//@Type GET
//@route /api/questions
//@Desc route for getting all questions 
//@access PUBLIC
//@Type POST
router.get("/",(req,res)=>
{
    Question.find()
    .sort({date:"desc"})
    .then(que=>{
        if(!que)
        {
            res.status(404).json({not:"There are no questions"});
        }
        else
        {
            res.json(que)
        }
    })
    .catch(err=>console.log(err));
})
//@type POST
//@route /api/questions
//@Desc route for submitting questions 
//@access PRIVATE
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>
{
    Profile.findOne({user:req.user.id})
    .then(person=>
    {
        if(person)
        {
            //So here i am grabing the username from the database
            const newQuestion=new Question({
                user:req.user.id,
                textone:req.body.textone,
                texttwo:req.body.texttwo,
                username:person.username
            })
            newQuestion.save()
            .then(question=>res.json(question))
            .catch(err=>console.log(err))
        }
        else
        {
            res.status(404).json({error:"Person is not found"});
        }
    })
    .catch(err=>console.log(err));

});
//@type POST
//@route /api/questions/answers/:q_id
//@Desc route for giving answers for a quesition
//@access PRIVATE
router.post('/answers/:q_id',passport.authenticate('jwt',{session:false}),(req,res)=>
{
    Question.findOne({_id:req.params.q_id})
    .then(question=>
        {
            const newAns={
                user:req.user.id,
                text:req.body.text,
                name:req.body.name
            }
            question.answers.unshift(newAns);
            question.save()
            .then(ans=>res.json(ans))
            .catch(err=>console.log(err))
        })
    .catch(err=>console.log(err))
});
//@type POST
//@route /api/questions/upvote/:q_id
//@Desc route for to store the votes resposnse of the user
//@access PRIVATE
router.post('/upvote/:q_id',passport.authenticate('jwt',{session:false}),(req,res)=>
{
    Profile.findOne({user:req.user.id})
    .then(person=>
        {
            if(!person)
            {
                res.status(401).json({error:"USer is not"});
            }
            else
            {
                Question.findById(req.params.q_id)
                .then(que=>
                    {
                        if(!que)
                        {
                            res.status(404).json({noque:"There is no question"});
                        }
                        else
                        {
                                if(que.upvotes.filter(ele=> ele.user.toString()===req.user.id.toString()).length>0)
                                {
                                    res.status(400).json({error:"Up vote already recorded"});
                                }
                                else
                                {
                                    que.upvotes.unshift({user:req.user.id});
                                    que.save()
                                    .then(bb=>res.json(bb))
                                    .catch(err=>console.log(err));
                                }
                        }
                    })
                .catch()
            }
        })
    .catch()

})
module.exports=router;