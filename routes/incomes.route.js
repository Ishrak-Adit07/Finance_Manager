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
const {
  getIncomeInfoPage,
  saveIncomeInfo,
} = require("../controllers/incomes.controller");
var { newIncomeInfo } = require("../models/newCashInfo.model");
var { currentUser } = require("../models/login.model");
const { runQuery } = require("../dbConnection/runFunctions");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.render(path.join(__dirname + "/../views/newIncome.ejs"), { currentUser });
});

router.post("/", async (req, res) => {
  newIncomeInfo.amount = Number(req.body.amount);
  newIncomeInfo.wallet = Number(req.body.wallet);
  newIncomeInfo.type = req.body.type;

  if (newIncomeInfo.wallet > 0 && newIncomeInfo.wallet <= currentUser.wallets) {
    const incomeDateObject = new Date();
    let year = incomeDateObject.getFullYear();
    let month = incomeDateObject.getMonth();
    let dt = incomeDateObject.getDate();
    let hr = incomeDateObject.getHours();
    let mm = incomeDateObject.getMinutes();
    let ss = incomeDateObject.getSeconds();
    let incomeDateInput = String(
      year + "-" + month + "-" + dt + " " + hr + "-" + mm + "-" + ss
    );
    console.log(incomeDateInput);
    //New Income id = inc+userid+year+mon+date+hr+min+ss
    let newIncomeID =
      "inc_" +
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
    console.log(newIncomeID);

    console.log(newIncomeInfo.amount);
    console.log(newIncomeInfo.wallet);
    console.log(newIncomeInfo.type);

    const newIncomeInsertQuery = `INSERT INTO "FINANCEMANAGER"."Incomes" VALUES ('${currentUser.userID}', '${newIncomeID}', 
                                     ${newIncomeInfo.wallet}, '${newIncomeInfo.type}', 
                                     ${newIncomeInfo.amount}, SYSDATE)`;
    //TO_DATE('${incomeDateInput}', 'YYYY-MM-DD HH24-MI-SS')
    const financialIncomeUpdateQuery = `UPDATE "FINANCEMANAGER"."FinancialInfo"
                                            SET "Amount" = "Amount" + ${newIncomeInfo.amount},
                                            "Last Updated On" = SYSDATE
                                            WHERE "UserID" LIKE '${currentUser.userID}'
                                            AND "WalletID" = ${newIncomeInfo.wallet}`;

    let newIncomeInsertQueryResult = await runQuery(newIncomeInsertQuery);
    let financialIncomeUpdateQueryResult = await runQuery(
      financialIncomeUpdateQuery
    );

    //Local variable update in the backend
    currentUser.amounts[newIncomeInfo.wallet] += newIncomeInfo.amount;
    console.log(currentUser.amounts);
  } else {
    console.log("Wallet Not Found");
  }

  res.redirect("/newIncomeInfo");
});

module.exports = router;
