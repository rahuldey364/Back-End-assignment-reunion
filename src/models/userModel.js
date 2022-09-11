const mongoose  = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followings:[{
        type:ObjectId,
        ref:"User"
    }],
    followers:[{
        type:ObjectId,
        ref:"User"
    }]

},{timestamps:true})

module.exports = mongoose.model("User" , userSchema)