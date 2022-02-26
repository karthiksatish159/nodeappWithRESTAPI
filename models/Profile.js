const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const profileSchema=new Schema({
    //So it as anchor point
    //You can consider it as the foriegn key for this table,So from this Key you can get the user details
    user:{
        type:Schema.Types.ObjectId,
        ref:"myPerson"
    },
    username:{
        type: String,
        required:true,
        max:50
    },
    webiste:{
        type: String
    },
    country:{
        type: String
    },
    languages:{
        type: [String],
        required:true
    },
    portfolio:{
        type: String
    },
    //So here we are creating a array of objects for workrole
    //So you can think that you are attaching a table without any complex joins
    workrole:[
       { 
        role:{
            type:String,
            required:true
        },
        company:{
            type:String
        },
        country:{
            type:String
        },
        from:{
            type:Date
        },
        to:{
            type:Date
        },
        current:{
            type:Boolean,
            default:false
        },
        details:{
            type:String
        }
       }
    ],
    social:{
        youtube:{
           type:String 
        },
        facebook:{
            type:String
        },
        instagram:{
            type:String
        }
    },
    date:{
            type:Date,
            default:Date.now()
    }


})
module.exports=Profile=mongoose.model("myProfile",profileSchema);