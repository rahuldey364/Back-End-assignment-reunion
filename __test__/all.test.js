const userModel = require("../src/models/userModel")
const productModel = require("../src/models/postModel")
const app = require("../src/app")
const request = require("supertest")
const postModel = require("../src/models/postModel")
require("../src/db/mongoose")

const userOne = {
    name: "Raghunath dey",
    number: 9825896544,
    email: "raghunathdey12@gmail.com",
    password: "Raghunath@123"
}

const userTwo = {
    name: "Priyanka Dey",
    number: 9825866544,
    email: "priyankadey123@gmail.com",
    password: "Priyanka@123"
}

beforeAll(async () => {
    await userModel.deleteMany()
    await productModel.deleteMany()
})

describe("POST /api/user/register", () => {
    it("it should create a new user", async () => {
        const response = await request(app).post("/api/user/register").send(userOne)
        expect(response.statusCode).toBe(201)
    })
})

let token = ""
let idOfFirstUser = ""
describe("POST /api/authenticate", () => {
    describe("given a username and password", () => {
        it("should respose with a 200 status code and a token", async () => {
            const response = await request(app).post("/api/authenticate").send({
                email: "raghunathdey12@gmail.com",
                password: "Raghunath@123"
            })
            const findUser = await userModel.findOne({ email: "raghunathdey12@gmail.com" })
            token = response.body.data.token
            idOfFirstUser = findUser._id.toString()
            expect(response.statusCode).toBe(200)
            expect(response.body.data.token).not.toBeNull()
        })

    })
    describe("given a wrong email", () => {
        it("should respose with a 400 status code", async () => {
            const response = await request(app).post("/api/authenticate").send({
                email: "raghunathdey@gmail.com",
                password: "Raghunath@123"
            })
            expect(response.statusCode).toBe(400)
            expect(response.body.status).toBeFalsy();
        })
    })
})

let idOfSecondUser = ""

describe("/api/follow/:id", () => {
    it("it should create one more new user", async () => {
        const response = await request(app).post("/api/user/register").send(userTwo)
        idOfSecondUser = response.body.data._id.toString()
        expect(response.statusCode).toBe(201)
    })
    describe("should userOne follow userTwo", () => {
        it("should return 200 statuscode", async () => {
            const response = await request(app).post("/api/follow/" + idOfSecondUser).set('Authorization', 'Bearer ' + token).set("params", idOfSecondUser)
            expect(response.statusCode).toBe(200)
        })
        it("should check the followers field of userTwo", async () => {
            const findUser = await userModel.findById(idOfSecondUser)
            expect(findUser.followers[findUser.followers.length-1].toString()).toEqual(idOfFirstUser)
        })
        it("should check the followings field of userOne", async () => {
            const findUser = await userModel.findById(idOfFirstUser)
            expect(findUser.followings[findUser.followings.length-1].toString()).toEqual(idOfSecondUser)
        })
    })
    
})

describe("/api/unfollow/:id", () => {
    describe("should userOne unfollow userTwo", () => {
        it("should return 200 statuscode", async () => {
            const response = await request(app).post("/api/unfollow/" + idOfSecondUser).set('Authorization', 'Bearer ' + token).set("params", idOfSecondUser)
            expect(response.statusCode).toBe(200)
        })
        it("should check the followers field of userTwo", async () => {
            const findUser = await userModel.findById(idOfSecondUser)
            expect(findUser.followers.length).toBe(0)
        })
        it("should check the followings field of userOne", async () => {
            const findUser = await userModel.findById(idOfFirstUser)
            expect(findUser.followings.length).toBe(0)
        })
    })
})

describe("GET /api/user", () => {
    describe("should check post with id" , () => {
        it("it should check 200 status code and the response body" , async () => {
            const response = await request(app).get("/api/user").set('Authorization', 'Bearer ' + token)
            expect(response.statusCode).toBe(200)
            expect(response.body.data).not.toBeNull()
        })
    })
})


const productOne = {
    title: "my test 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
}
let userOneCreatedPostId = ""
describe("POST /api/posts", () => {
    describe("given title and description of the post", () => {
        it("should check 201 status code and valid response body", async () => {
            const response = await request(app).post("/api/posts").set('Authorization', 'Bearer ' + token).send(productOne)
            userOneCreatedPostId = response.body.data.postId
            expect(response.statusCode).toBe(201)
            expect(response.body.data.title).toEqual("my test 1");
            expect(response.body.data.description).toEqual("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.");
            expect(response.body.data).toHaveProperty("postId")
            expect(response.body.data).toHaveProperty("createdAt")
        })
    })
    describe("if title field is missing", () => {
        it("should check 400 status code", async () => {
            const response = await request(app).post("/api/posts").set('Authorization', 'Bearer ' + token).send({
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing eli"
            })
            expect(response.statusCode).toBe(400)
        })
    })
    describe("if description field is missing", () => {
        it("should check 400 status code", async () => {
            const response = await request(app).post("/api/posts").set('Authorization', 'Bearer ' + token).send({
                title: "post test failed"
            })
            expect(response.statusCode).toBe(400)
        })
    })
    describe("should check if post is created on database with missing title and description", () => {
        it("should check db count", async () => {
            const response = await postModel.find({ postedBy: idOfFirstUser })
            expect(response.length).toBe(1)
        })
    })
})
let token2 = ""
describe("POST /api/like/:id", () => {
    it("It should return a token and id for userTwo", async () => {
        const response = await request(app).post("/api/authenticate").send({
            email: "priyankadey123@gmail.com",
            password: "Priyanka@123"
        })
        token2 = response.body.data.token.toString()
    })
    describe("userTwo should like userOne's post" , () => {
        it("it should check 200 status code" , async () => {
            const response = await request(app).post("/api/like/" + userOneCreatedPostId).set('Authorization', 'Bearer ' + token2).set("params", userOneCreatedPostId)
            expect(response.statusCode).toBe(200)
        })
        it("database check" , async () =>{
            const findPost = await postModel.findById(userOneCreatedPostId)
            expect(findPost.likes[findPost.likes.length - 1].toString()).toEqual(idOfSecondUser)
        })
    })
})

describe("POST /api/unlike/:id", () => {
    describe("userTwo should unlike userOne's post" , () => {
        it("it should check 200 status code" , async () => {
            const response = await request(app).post("/api/unlike/" + userOneCreatedPostId).set('Authorization', 'Bearer ' + token2).set("params", userOneCreatedPostId)
            expect(response.statusCode).toBe(200)
        })
        it("database check" , async () =>{
            const findPost = await postModel.findById(userOneCreatedPostId)
            expect(findPost.likes.length).toBe(0)
        })
    })
})

describe("POST /api/comment/:id", () => {
    describe("userTwo should comment on userOne's post" , () => {
        it("it should check 200 status code and the response body" , async () => {
            const response = await request(app).post("/api/comment/" + userOneCreatedPostId).set('Authorization', 'Bearer ' + token2).set("params", userOneCreatedPostId)
            expect(response.statusCode).toBe(200)
            expect(response.body.data.commentId).not.toBeNull()
        })
        it("database check" , async () =>{
            const findPost = await postModel.findById(userOneCreatedPostId)
            expect(findPost.comments[findPost.comments.length - 1].commentedBy.toString()).toBe(idOfSecondUser)
        })
    })
})

describe("GET /api/posts/:id", () => {
    describe("should check post with id" , () => {
        it("it should check 200 status code and the response body" , async () => {
            const response = await request(app).get("/api/posts/" + userOneCreatedPostId).set("params", userOneCreatedPostId)
            expect(response.statusCode).toBe(200)
            expect(response.body.data.title).not.toBeNull()
            expect(response.body.data.description).not.toBeNull()
            expect(response.body.data.title).not.toBeNull()
            expect(response.body.data.title).not.toBeNull()
            expect(response.body.data.title).not.toBeNull()
        })
    })
})

describe("GET /api/all_posts", () => {
    describe("should check all posts" , () => {
        it("it should check 200 status code and the response body" , async () => {
            const response = await request(app).get("/api/all_posts").set('Authorization', 'Bearer ' + token2)
            expect(response.statusCode).toBe(200)
            expect(response.body.data).not.toBeNull()
        })
    })
})

describe("DELETE /api/posts/:id", () => {
    describe("userTwo should unlike userOne's post" , () => {
        it("it should check 200 status code and the response body" , async () => {
            const response = await request(app).delete("/api/posts/" + userOneCreatedPostId).set('Authorization', 'Bearer ' + token).set("params", userOneCreatedPostId)
            expect(response.statusCode).toBe(200)
            expect(response.body.data).not.toBeNull()
        })
        it("database check" , async () =>{
            const findPost = await postModel.findById(userOneCreatedPostId)
            expect(findPost).toBeNull()
        })
    })
})



