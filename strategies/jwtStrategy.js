const JwtStrategy=require('passport-jwt').Strategy;
const ExtractJwtStrategy=require('passport-jwt').ExtractJwt;
const myKey=require('../setup/myUrl');
const mongoose=require('mongoose');

const Person=mongoose.model('myPerson')
const opts={}
//Getting the authorization header value
//So here strategy will be extract the informations from the these options and after verfication of signatute it will
//decode the payload from base64 to normal form and based on unique id what ever we got from that payload,Using that id we 
//will search that person in database.
opts.jwtFromRequest=ExtractJwtStrategy.fromAuthHeaderAsBearerToken();
opts.secretOrKey=myKey.secreat;
//This passport object is came from the index.js 
module.exports=passport1=>{
    passport1.use(new JwtStrategy(opts,(jwt_payload,done)=>
    {
        console.log("We are in the st");

        Person.findById(jwt_payload.id)
        .then(person=>{
            if(person)
            {
                console.log(person);
                return done(null,person);
            }
            return done(null,false);
        })
        .catch(err=>console.log(err))
    }));
}
