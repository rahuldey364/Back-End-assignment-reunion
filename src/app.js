const express = require("express")
const app = express()
require("../src/db/mongoose")
const route = require("./route/route")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/", route)


module.exports = app