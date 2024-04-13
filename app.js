//jshint esversion:6
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express()

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb://0.0.0.0:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret = "Thisismynewsecret"
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']})

const User = new mongoose.model("User", userSchema)

app.get("/", function(req, res) {
    res.render("home")
})

app.get("/login", function(req, res) {
    res.render("login")
})

app.get("/register", function(req, res) {
    res.render("register")
})

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save()
    res.render("secrets")
})

app.post("/login", function(req, res) {
    const username = req.body.username
    const password = req.body.password

    const foundUser = User.findOne({email: username})

    if(foundUser) {
        if(foundUser.password = password) {
            res.render("secrets")
        }
    }
})


app.listen(3000, function() {
    console.log("Server is runnig on port 3000")
})