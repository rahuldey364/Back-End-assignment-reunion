const express = require("express")
const mongoose  = require("mongoose")
const app = express()
const route = require("./route/route")
require("dotenv").config()

const PORT  = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser:true
})
.then(()=>{
    console.log("Mongo is connected succesfully")
})
.catch((err) =>{
    console.log(err)
})


app.use("/",route)

app.listen(PORT,()=>{
    console.log(`Express App Is Running At Port ${PORT}`)
})

