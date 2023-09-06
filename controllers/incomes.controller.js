const path = require('path');
var newIncomeInfo = require("../models/newCashInfo.model.js");
var { currentUser } = require('../models/login.model');

exports.getIncomeInfoPage = (req, res) =>{
    res.render(path.join(__dirname+"/../views/newIncome.ejs"), {currentUser});
};

exports.saveIncomeInfo = (req, res) =>{
    newIncomeInfo.amount = Number(req.body.amount);
    newIncomeInfo.wallet = Number(req.body.wallet)-1;
    newIncomeInfo.type = req.body.type;

    if(newIncomeInfo.wallet+1 <= currentUser.wallets){
        currentUser.amounts[newIncomeInfo.wallet] += newIncomeInfo.amount;
        console.log(currentUser.amounts);

        console.log(newIncomeInfo.amount);
        console.log(newIncomeInfo.wallet+1);
        console.log(newIncomeInfo.type);
    }
    else{
        console.log("Wallet Not Found");
    }

    res.redirect("/newIncomeInfo");
}