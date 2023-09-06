const path = require('path');
var { currentUser } = require('../models/login.model');

exports.getSignUpPage = (req, res) =>{
    res.render(path.join(__dirname+"/../views/signup.ejs"), {});
};

exports.getToCreateAccountPage = (req, res) =>{
    res.redirect("/createAccount");
}