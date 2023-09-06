const path = require('path');
var newBudgetInfo = require("../models/newCashInfo.model.js");
var { currentUser } = require('../models/login.model');

exports.getNewBudgetPage = (req, res) =>{
    res.render(path.join(__dirname+"/../views/newBudget.ejs"), {currentUser});
};

exports.saveNewBudget = (req, res) =>{
    newBudgetInfo.amount = Number(req.body.amount);
    newBudgetInfo.purpose = req.body.purpose;

    console.log(newBudgetInfo.amount);
    console.log(newBudgetInfo.purpose);

    const budgetDateObject = new Date();
    let year = budgetDateObject.getFullYear(); let month = budgetDateObject.getMonth(); let dt = budgetDateObject.getDate();
    let hr = budgetDateObject.getHours(); let mm = budgetDateObject.getMinutes(); let ss = budgetDateObject.getSeconds();
    let budgetDateInput = String(year+'-'+month+'-'+dt+' '+hr+'-'+mm+'-'+ss);
    console.log(budgetDateInput);
    //New Budget id = budg+userid+year+mon+date+hr+min+ss
    let newBudgetId = "budg_"+currentUser.userID+'_'+year+'.'+month+'.'+dt+'_'+hr+'.'+mm+'.'+ss;
    console.log(newBudgetId);

    res.redirect("/newBudget");
}