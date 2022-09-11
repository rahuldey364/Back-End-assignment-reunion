const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const createUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const findUser = await userModel.findOne({ email: email })
        if (findUser) return res.json({ status: false, error: "email already registered" })

        let saltRound = await bcrypt.genSalt(10)
        let encryptedPassword = await bcrypt.hash(password, saltRound)

        req.body.password = encryptedPassword

        let userData = await userModel.create(req.body)
        res.json({ status: true, data: userData })

    } catch (err) {
        res.json({ status: false, error: err })
    }
}

const authenticateUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!emailRegex.test(email)) return res.json({ status: false, error: "enter a valid email" })
        const findUser = await userModel.findOne({ email: email })
        if (!findUser) return res.json({ status: false, error: "this email is not registered yet" })

        const passwordCheck = await bcrypt.compare(password, findUser.password)
        if (!passwordCheck) return res.json({ status: false, error: "enter a valid password" })

        const token = jwt.sign({ userId: findUser._id }, "mySecretKey", { expiresIn: "24 hours" })

        res.json({ status: true, data: { token: token } })

    } catch (err) {
        res.json({ status: false, error: err })
    }
}

const followUser = async (req,res) => {
    try {
  
        const updateFollowers = await userModel.findByIdAndUpdate(req.params.id, {$push:{followers:req.userId}},{new:true})
        
        const updateFollowings = await userModel.findByIdAndUpdate(req.userId,  {$push:{followings:req.params.id}},{new:true})

        return res.json({ status: true, message:"follow sucessful"})
    } catch (error) {
        res.json({ status: false, error: error })
    }
}

const unFollowUser = async (req,res) => {
    try {
  
        const updateFollowers = await userModel.findByIdAndUpdate(req.params.id, {$pull:{followers:req.userId}},{new:true})
        
        const updateFollowings = await userModel.findByIdAndUpdate(req.userId,  {$pull:{followings:req.params.id}},{new:true})

        return res.json({ status: true, message:"follow sucessful"})
    } catch (error) {
        res.json({ status: false, error: error })
    }
}

const getUser = async (req,res) => {
    try {
        const userDetails = await userModel.findById(req.userId)

        const result = {
            userName : userDetails.name,
            followers: userDetails.followers.length,
            followings: userDetails.followings.length
        }

        res.json({status:true , data: result})
    } catch (error) {
        res.json({ status: false, error: error })
    }
}


module.exports = { createUser , authenticateUser , followUser , unFollowUser , getUser }
