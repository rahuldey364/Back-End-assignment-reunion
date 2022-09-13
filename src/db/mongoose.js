const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
})
    .then(() => {
        console.log("Mongo is connected succesfully")
    })
    .catch((err) => {
        console.log(err)
    })