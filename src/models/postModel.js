const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    likes: [{
        type: ObjectId,
        ref: "User"
    }],
    comments: [{
        comment: String,
        commentId:String,
        commentedBy: {
            type: ObjectId,
            ref: "User"
        }
    }]

},{timestamps:true})

module.exports = mongoose.model("Post", postSchema)