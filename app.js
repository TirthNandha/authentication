//jshint esversion:6
require("dotenv").config()
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const md5 = require("md5")
const bcrypt = require("bcrypt")
const saltRounds = 10

const app = express()

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb://0.0.0.0:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


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

    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        })
    
        newUser.save()
        res.render("secrets")
    });

})

app.post("/login", async function(req, res) {
    const username = req.body.username
    const password = req.body.password

    const foundUser = await User.findOne({email: username})

    if(foundUser) {
        bcrypt.compare(password, foundUser.password).then(function(result) {
            if(result === true) {
                res.render("secrets")
            }
        });
    }
})


app.listen(3000, function() {
    console.log("Server is runnig on port 3000")
})