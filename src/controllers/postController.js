const postModel = require("../models/postModel")


const createPost = async (req, res) => {
    try {
        const { title, description } = req.body

        if (!title) return res.json({ status: false, message: "title is a required field for creating a post" })
        if (!description) return res.json({ status: false, message: "title is a required field for creating a post" })

        req.body.postedBy = req.userId
        const createdPost = await postModel.create(req.body)

        res.status(201).json({ status: true, data: createdPost })

    } catch (error) {
        res.status(500).json({ status: false, error: error })
    }
}

const likePost = async (req, res) => {
    try {
        const updateLike = await postModel.findByIdAndUpdate(req.params.id, { $push: { likes: req.userId } }, { new: true })
        res.status(200).json({ status: true, data: updateLike })
    } catch (error) {
        // console.log(error)
        res.status(500).json({ status: false, error: error })
    }
}

const unLikePost = async (req, res) => {
    try {
        const updateLike = await postModel.findByIdAndUpdate(req.params.id, { $pull: { likes: req.userId } }, { new: true })
        res.status(200).json({ status: true, data: updateLike })
    } catch (error) {
        res.status(500).json({ status: false, error: error })
    }
}

const commentPost = async (req, res) => {
    try {

        const updateComment = await postModel.findByIdAndUpdate(req.params.id, { $push: { comments: { comment: req.body.comment, commentedBy: req.userId } } }, { new: true })
        
        res.status(200).json({ status: true, data: { commentId: updateComment.comments[updateComment.comments.length - 1]._id } })

    } catch (error) {
        res.status(500).json({ status: false, error: error })
    }
}

const getPost = async (req , res ) => {
    try {
        const fetchPost = await postModel.findById(req.params.id)
        const result = {
            title: fetchPost.title,
            description:fetchPost.description,
            postedBy:fetchPost.postedBy,
            likes:fetchPost.likes.length,
            comments:fetchPost.comments.length
        }
        res.status(200).status(500).json({status:true, data:result})

    } catch (error) {
        res.json({ status: false, error: error })
    }
}

const getAllPosts = async (req,res) => {

    try {
        const findAllPosts = await postModel.find({postedBy:req.userId}).select({_id:1,title:1,description:1,createdAt:1,comments:1,likes:1}).sort({createdAt:-1})
        
       const result = findAllPosts.map((x) => ({
           id:x._id,
           title:x.title,
           description: x.description,
           createdAt:x.createdAt,
           comments:x.comments.map((y) => ({
           comment:y.comment
           })),
           likes:x.likes.length

        }))
        // console.log(allcomments)
        res.status(200).json({status:true, data:result})
    } catch (error) {
        res.status(500).json({ status: false, error: error })
    }
}

const deletePost = async (req,res) => {
    try {
        const deletedPost = await postModel.findOneAndDelete({_id:req.params.id,postedBy:req.userId})
        if(!deletedPost) return res.json({status:false,message: "post does not belong to this account"})

        res.status(200).json({status:true, data:"post deleted sucessfully"})
    } catch (error) {
        res.status(500).json({ status: false, error: error })
    }
}

module.exports = { createPost, likePost, unLikePost, commentPost , getPost ,getAllPosts ,deletePost}