const path = require('path');
var { currentUser } = require('../models/login.model');

const dbConnection = require("../dbConnection/dbConnection.js");
const { runQuery } = require("../dbConnection/runFunctions.js");
dbConnection.connect();

exports.getCreateAccountPage = (req, res) =>{
    let message = "   ";
    res.render(path.join(__dirname+"/../views/createAccount.ejs"), {message});
}

exports.verifyCreateAccount = (req, res) =>{
    currentUser.userID = req.body.username;
    console.log(currentUser.userID);
    let loggedPassword = req.body.password;
    console.log(loggedPassword);

    res.redirect("/home");
}