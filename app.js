require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});


app.get("/login", function(req, res){
    res.render("login");
});


app.get("/register", function(req, res){
    res.render("register");
});


app.post("/register", async function(req, res){
    
    const username = req.body.username;
    const password = req.body.password;
    
    const newUser = new User({
        email: username,
        password: password
    });

    const result = await newUser.save();
    if(result){
        res.render("secrets");
    }else{
        console.log("An error occurs");
    }

});


app.post("/login", async function(req, res){
    
    const username = req.body.username;
    const password = req.body.password;
    const foundUser = await User.findOne({email: username});
    
    if(!foundUser){
        console.log("Cannot find the user");
    }else{
        if(foundUser.password === password){
            res.render("secrets");
        }else{
            console.log("Incorrect Password");
        }
    }

});


















app.listen("5000", function(){
    console.log("Server started on port 5000");
});
