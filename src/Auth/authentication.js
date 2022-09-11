const jwt = require("jsonwebtoken")
// const userController = require("../controllers/userController")

const authentication = (req, res, next) => {
    try {
        const header = req.header("Authorization")
        if (!header) return res.json({ status: false, error: "token required !!!" })

        let splitToken = header.split(" ")
        let token = splitToken[1]

        let decodedToken = jwt.verify(token, "mySecretKey")

        req.userId = decodedToken.userId

        next()

    } catch (error) {
        res.json({ status: false, error: err })
    }
}

module.exports = {authentication}