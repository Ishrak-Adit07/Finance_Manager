const path = require('path');
var { currentUser } = require('../models/login.model');

exports.getCurrentStatusPage = (req, res) =>{
    res.render(path.join(__dirname+"/../views/currentStatus.ejs"), {currentUser});
};

exports.saveCurrentStatus = (req, res) =>{
    currentUser.wallets += 1;
    currentUser.amounts.push(0);

    res.redirect("/currentStatus");
}