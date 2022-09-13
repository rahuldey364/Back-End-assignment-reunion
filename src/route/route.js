const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const auth = require("../Auth/authentication")
const postController = require("../controllers/postController")



 router.post("/api/user/register" , userController.createUser )
router.post("/api/authenticate" , userController.authenticateUser )
router.post("/api/follow/:id" , auth.authentication, userController.followUser)
router.post("/api/unfollow/:id" , auth.authentication, userController.unFollowUser)
router.get("/api/user", auth.authentication , userController.getUser)
router.post("/api/posts", auth.authentication, postController.createPost)
router.delete("/api/posts/:id" ,auth.authentication, postController.deletePost )
router.post("/api/like/:id", auth.authentication, postController.likePost )
router.post("/api/unlike/:id", auth.authentication, postController.unLikePost)
router.post("/api/comment/:id" , auth.authentication , postController.commentPost)
router.get("/api/posts/:id" ,postController.getPost)
router.get("/api/all_posts" ,auth.authentication, postController.getAllPosts)

module.exports = router