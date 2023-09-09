const express = require('express');
const router = express.Router();
const path = require('path');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var { currentUser } = require('../models/login.model');
const { runQuery } = require('../dbConnection/runFunctions');
const { currentBudgets } = require('../models/myBudget.model');
const { editBudgetInfo } = require('../models/editBudgets.model');

router.get("/", (req, res)=>{
    res.render(path.join(__dirname+"/../views/editBudgets.ejs"), {currentUser, currentBudgets});
});

router.post("/", async(req, res)=>{
    editBudgetInfo.budgetID = req.body.budgetID;
    editBudgetInfo.totalAmountUpdate = req.body.newTotalBudget;
    editBudgetInfo.addToSpent = req.body.spent;
    editBudgetInfo.saveFromSpent = req.body.save;

    if(!editBudgetInfo.totalAmountUpdate) editBudgetInfo.totalAmountUpdate = 0;
    if(!editBudgetInfo.addToSpent) editBudgetInfo.addToSpent = 0;
    if(!editBudgetInfo.saveFromSpent) editBudgetInfo.saveFromSpent = 0;

    if(editBudgetInfo.budgetID <= currentUser.budgets){

        const budgetEditDateObject = new Date();
        let year = budgetEditDateObject.getFullYear(); let month = budgetEditDateObject.getMonth(); let dt = budgetEditDateObject.getDate();
        let hr = budgetEditDateObject.getHours(); let mm = budgetEditDateObject.getMinutes(); let ss = budgetEditDateObject.getSeconds();
        let budgetEditDateInput = String(year+'-'+month+'-'+dt+' '+hr+'-'+mm+'-'+ss);
        console.log(budgetEditDateInput);

        const updateTotalAmountQuery = `UPDATE "FINANCEMANAGER"."Budgets"
                                        SET "Amount" = ${editBudgetInfo.totalAmountUpdate},
                                        "Last Updated On" = TO_DATE('${budgetEditDateInput}', 'YYYY-MM-DD HH24-MI-SS')
                                        WHERE "UserID" LIKE ${currentUser.userID}
                                        AND "BudgetID" = ${editBudgetInfo.budgetID};`;
        //let updateTotalAmountQueryResult = await runQuery(updateTotalAmountQuery);
        //Trigger******************************************************************

        const addToSpentQuery = `UPDATE "FINANCEMANAGER"."Budgets"
                                 SET "Spent" = "Spent" + ${editBudgetInfo.addToSpent},
                                 "Left" = "Left" - ${editBudgetInfo.addToSpent},
                                 TO_DATE('${budgetEditDateInput}', 'YYYY-MM-DD HH24-MI-SS')
                                 WHERE "UserID" LIKE ${currentUser.userID}
                                 AND "BudgetID" = ${editBudgetInfo.budgetID};`;
        //let addToSpentQueryResult = await runQuery(addToSpentQuery);

        const saveFromSpentQuery = `UPDATE "FINANCEMANAGER"."Budgets"
                                    SET "Spent" = "Spent" - ${editBudgetInfo.saveFromSpent}, 
                                    "Left" = "Left" + ${editBudgetInfo.saveFromSpent},
                                    TO_DATE('${budgetEditDateInput}', 'YYYY-MM-DD HH24-MI-SS')
                                    WHERE "UserID" LIKE ${currentUser.userID}
                                    AND "BudgetID" = ${editBudgetInfo.budgetID};`;
        //let saveFromSpentQueryResult = await runQuery(saveFromSpentQuery);

        if(editBudgetInfo.totalAmountUpdate != 0) currentBudgets[editBudgetInfo.budgetID].amount = editBudgetInfo.totalAmountUpdate;
        if(editBudgetInfo.addToSpent != 0 ){
            currentBudgets[editBudgetInfo.budgetID].spent += editBudgetInfo.addToSpent;
            currentBudgets[editBudgetInfo.budgetID].left -= editBudgetInfo.addToSpent;
            currentBudgets[editBudgetInfo.budgetID].lastUpdatedOn = budgetEditDateInput;
        }
        if(editBudgetInfo.saveFromSpent != 0){
            currentBudgets[editBudgetInfo.budgetID].spent -= editBudgetInfo.saveFromSpent;
            currentBudgets[editBudgetInfo.budgetID].left += editBudgetInfo.saveFromSpent;
            currentBudgets[editBudgetInfo.budgetID].lastUpdatedOn = budgetEditDateInput;
        }

    }

    res.render(path.join(__dirname+"/../views/editBudgets.ejs"), {currentUser, currentBudgets});
});

module.exports = router;