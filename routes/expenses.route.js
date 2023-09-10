const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const {
  getExpenseInfoPage,
  saveExpenseInfo,
} = require("../controllers/expenses.controller");
var { currentUser } = require("../models/login.model");
var { newExpenseInfo } = require("../models/newCashInfo.model");
const { runQuery } = require("../dbConnection/runFunctions");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", getExpenseInfoPage);

router.post("/", async (req, res) => {
  newExpenseInfo.amount = Number(req.body.amount);
  newExpenseInfo.wallet = Number(req.body.wallet);
  newExpenseInfo.type = req.body.type;

  if (
    newExpenseInfo.wallet > 0 &&
    newExpenseInfo.wallet <= currentUser.wallets
  ) {
    const expenseDateObject = new Date();
    let year = expenseDateObject.getFullYear();
    let month = expenseDateObject.getMonth();
    let dt = expenseDateObject.getDate();
    let hr = expenseDateObject.getHours();
    let mm = expenseDateObject.getMinutes();
    let ss = expenseDateObject.getSeconds();
    let expenseDateInput = String(
      year + "-" + month + "-" + dt + " " + hr + "-" + mm + "-" + ss
    );
    console.log(expenseDateInput);
    //New Expense id = exp+userid+year+mon+date+hr+min+ss
    let newExpenseID =
      "exp_" +
      currentUser.userID +
      "_" +
      year +
      "." +
      month +
      "." +
      dt +
      "_" +
      hr +
      "." +
      mm +
      "." +
      ss;
    console.log(newExpenseID);

    console.log(newExpenseInfo.amount);
    console.log(newExpenseInfo.wallet);
    console.log(newExpenseInfo.type);

    const newExpenseInsertQuery = `INSERT INTO "FINANCEMANAGER"."Expenses" VALUES ('${currentUser.userID}', '${newExpenseID}', 
                                     ${newExpenseInfo.wallet}, '${newExpenseInfo.type}', 
                                     ${newExpenseInfo.amount}, TO_DATE('${expenseDateInput}', 'YYYY-MM-DD HH24-MI-SS'))`;
    const financialExpenseUpdateQuery = `UPDATE "FINANCEMANAGER"."FinancialInfo"
                                            SET "Amount" = "Amount" - ${newExpenseInfo.amount},
                                            "Last Updated On" = TO_DATE('${expenseDateInput}', 'YYYY-MM-DD HH24-MI-SS')
                                            WHERE "UserID" LIKE '${currentUser.userID}'
                                            AND "WalletID" = ${newExpenseInfo.wallet}`;

    let newExpenseInsertQueryResult = await runQuery(newExpenseInsertQuery);
    let financialExpenseUpdateQueryResult = await runQuery(
      financialExpenseUpdateQuery
    );

    console.log(newExpenseInfo.amount);
    console.log(newExpenseInfo.wallet + 1);
    console.log(newExpenseInfo.type);

    currentUser.amounts[newExpenseInfo.wallet] -= newExpenseInfo.amount;
    console.log(currentUser.amounts);
  } else {
    console.log("Wallet Not Found");
  }

  res.redirect("/newExpenseInfo");
});

module.exports = router;
