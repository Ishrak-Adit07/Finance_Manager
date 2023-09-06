const path = require('path');
var newExpenseInfo = require("../models/newCashInfo.model.js");
var { currentUser } = require('../models/login.model');

exports.getExpenseInfoPage = (req, res) =>{
    res.render(path.join(__dirname+"/../views/newexpense.ejs"), {currentUser});
};

exports.saveExpenseInfo = (req, res) =>{
    newExpenseInfo.amount = Number(req.body.amount);
    newExpenseInfo.wallet = Number(req.body.wallet)-1;
    newExpenseInfo.type = req.body.type;

    if(newExpenseInfo.wallet+1 <= currentUser.wallets ){
        currentUser.amounts[newExpenseInfo.wallet] = currentUser.amounts[newExpenseInfo.wallet] - newExpenseInfo.amount;
        console.log(currentUser.amounts);

        console.log(newExpenseInfo.amount);
        console.log(newExpenseInfo.wallet+1);
        console.log(newExpenseInfo.type);
    }
    else{
        console.log("Wallet Not Found");
    }

    res.redirect("/newExpenseInfo");
}