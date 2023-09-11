const express = require("express");
const router = express.Router();
const path = require("path");

const session = require("express-session");
router.use(
  session({
    secret: "financemanager",
    resave: false,
    saveUninitialized: true,
  })
);

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var { currentUser } = require("../models/login.model");
const { runQuery } = require("../dbConnection/runFunctions");
const { currentBudgets } = require("../models/myBudget.model");
const { editBudgetInfo } = require("../models/editBudgets.model");

router.get("/", async (req, res) => {
  const getMyBudgetInfosQuery = `SELECT * FROM "FINANCEMANAGER"."Budgets"
                                   WHERE "UserID" LIKE '${currentUser.userID}'`;
  let getMyBudgetInfosQueryResult = await runQuery(getMyBudgetInfosQuery);

  currentBudgets.length = 0;
  for (var i in getMyBudgetInfosQueryResult) {
    let param1 = getMyBudgetInfosQueryResult[i][1];
    let param2 = getMyBudgetInfosQueryResult[i][2];
    let param3 = getMyBudgetInfosQueryResult[i][3];
    let param4 = getMyBudgetInfosQueryResult[i][4];
    let param5 = getMyBudgetInfosQueryResult[i][5];
    let param6 = String(getMyBudgetInfosQueryResult[i][6]);
    let param7 = String(getMyBudgetInfosQueryResult[i][7]);
    param6 = param6.substring(0, 25);
    param7 = param7.substring(0, 25);

    let currBudget = { param1, param2, param3, param4, param5, param6, param7 };
    currentBudgets.push(currBudget);
  }

  res.render(path.join(__dirname + "/../views/editBudgets.ejs"), {
    currentUser,
    currentBudgets,
  });
});

router.post("/", async (req, res) => {
  editBudgetInfo.budgetID = Number(req.body.budgetID);
  editBudgetInfo.totalAmountUpdate = Number(req.body.newTotalBudget);
  editBudgetInfo.addToSpent = Number(req.body.spent);
  editBudgetInfo.saveFromSpent = Number(req.body.save);

  if (!editBudgetInfo.totalAmountUpdate || editBudgetInfo.totalAmountUpdate < 0)
    editBudgetInfo.totalAmountUpdate = 0;
  if (!editBudgetInfo.addToSpent) editBudgetInfo.addToSpent = 0;
  if (!editBudgetInfo.saveFromSpent) editBudgetInfo.saveFromSpent = 0;

  console.log(editBudgetInfo.totalAmountUpdate);
  console.log(editBudgetInfo.addToSpent);
  console.log(editBudgetInfo.saveFromSpent);

  if (editBudgetInfo.budgetID <= currentUser.budgets) {
    const budgetEditDateObject = new Date();
    let year = budgetEditDateObject.getFullYear();
    let month = budgetEditDateObject.getMonth();
    let dt = budgetEditDateObject.getDate();
    let hr = budgetEditDateObject.getHours();
    let mm = budgetEditDateObject.getMinutes();
    let ss = budgetEditDateObject.getSeconds();
    let budgetEditDateInput = String(
      year + "-" + month + "-" + dt + " " + hr + "-" + mm + "-" + ss
    );
    console.log(budgetEditDateInput);

    if (editBudgetInfo.totalAmountUpdate > 0) {
      const currentSpentQuery = `SELECT "Spent"
                                 FROM "FINANCEMANAGER"."Budgets"
                                 WHERE "UserID" LIKE '${currentUser.userID}'
                                 AND "BudgetID" = ${editBudgetInfo.budgetID}`;
      let currentSpentQueryResult = await runQuery(currentSpentQuery);
      console.log(currentSpentQueryResult);
      let currSpent = currentSpentQueryResult[0][0];
      console.log(currSpent);
      let newLeft = editBudgetInfo.totalAmountUpdate - currSpent;
      const updateTotalAmountQuery = `UPDATE "FINANCEMANAGER"."Budgets"
                                        SET "Amount" = ${editBudgetInfo.totalAmountUpdate},
                                        "Left" = ${newLeft},
                                        "Last Updated On" = SYSDATE
                                        WHERE "UserID" LIKE '${currentUser.userID}'
                                        AND "BudgetID" = ${editBudgetInfo.budgetID}`;
      console.log(updateTotalAmountQuery);
      let updateTotalAmountQueryResult = await runQuery(updateTotalAmountQuery);
    }
    //Trigger******************************************************************

    const addToSpentQuery = `UPDATE "FINANCEMANAGER"."Budgets"
                                 SET "Spent" = "Spent" + ${editBudgetInfo.addToSpent},
                                 "Left" = "Left" - ${editBudgetInfo.addToSpent},
                                 "Last Updated On" = SYSDATE
                                 WHERE "UserID" LIKE '${currentUser.userID}'
                                 AND "BudgetID" = ${editBudgetInfo.budgetID}`;
    console.log(addToSpentQuery);
    let addToSpentQueryResult = await runQuery(addToSpentQuery);

    const saveFromSpentQuery = `UPDATE "FINANCEMANAGER"."Budgets"
                                    SET "Spent" = "Spent" - ${editBudgetInfo.saveFromSpent}, 
                                    "Left" = "Left" + ${editBudgetInfo.saveFromSpent},
                                    "Last Updated On" = SYSDATE
                                    WHERE "UserID" LIKE '${currentUser.userID}'
                                    AND "BudgetID" = ${editBudgetInfo.budgetID}`;
    console.log(saveFromSpentQuery);
    let saveFromSpentQueryResult = await runQuery(saveFromSpentQuery);

    /*
    if (editBudgetInfo.totalAmountUpdate != 0) {
      currentBudgets[editBudgetInfo.budgetID].amount =
        editBudgetInfo.totalAmountUpdate;
    }
    if (editBudgetInfo.addToSpent != 0) {
      currentBudgets[editBudgetInfo.budgetID].spent +=
        editBudgetInfo.addToSpent;
      currentBudgets[editBudgetInfo.budgetID].left -= editBudgetInfo.addToSpent;
      currentBudgets[editBudgetInfo.budgetID].lastUpdatedOn =
        budgetEditDateInput;
    }
    if (editBudgetInfo.saveFromSpent != 0) {
      currentBudgets[editBudgetInfo.budgetID].spent -=
        editBudgetInfo.saveFromSpent;
      currentBudgets[editBudgetInfo.budgetID].left +=
        editBudgetInfo.saveFromSpent;
      currentBudgets[editBudgetInfo.budgetID].lastUpdatedOn =
        budgetEditDateInput;
    }
    */
  }

  res.redirect("/home");
});

module.exports = router;
