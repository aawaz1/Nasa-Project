import mongoose from "mongoose";

const launchSchema = new mongoose.Schema({
    flightNumber : {
        type : Number,
        required : true,
        unique : true,

    }
    ,
    launchDate : {
        type : Date,
        required : true,

    },
    mission : {
        type : String ,
        required : true ,

    },
    rocket : {
        type : String ,
        required : true ,
     },
    target : {
        type : String ,
       
    },

    customers : [String],

    upcoming : {
        type : Boolean,
        required : true,
        default : true,

    },
    success : {
        type : Boolean,
        required : true,
        default : true,
        
    }




});


export default mongoose.model('Launch', launchSchema);