const express = require("express");
const router = express.Router();

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

const path = require("path");
var { currentUser } = require("../models/login.model");
const { runQuery } = require("../dbConnection/runFunctions");
const { route } = require("../app");
const { transactionInfo } = require("../models/transaction.model");

router.get("/", (req, res) => {
  currentUser = req.session.currentUser;
  res.render(path.join(__dirname + "/../views/transaction.ejs"), {
    currentUser,
  });
});

router.post("/", async (req, res) => {
  currentUser = req.session.currentUser;
  transactionInfo.senderUserID = currentUser.userID;
  transactionInfo.senderWalletID = req.body.senderWalletID;
  transactionInfo.receiverUserID = req.body.receiverUserID;
  transactionInfo.receiverWalletID = 1;
  transactionInfo.amount = req.body.amount;

  if (0 < transactionInfo.senderWalletID <= currentUser.wallets) {
    const transactionDateObject = new Date();
    let year = transactionDateObject.getFullYear();
    let month = transactionDateObject.getMonth();
    let dt = transactionDateObject.getDate();
    let hr = transactionDateObject.getHours();
    let mm = transactionDateObject.getMinutes();
    let ss = transactionDateObject.getSeconds();
    let transactionDateInput = String(
      year + "-" + month + "-" + dt + " " + hr + "-" + mm + "-" + ss
    );
    console.log(transactionDateInput);
    //New Income id = inc+userid+year+mon+date+hr+min+ss
    let newIncomeID =
      "inc_" +
      transactionInfo.receiverUserID +
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

    console.log(transactionInfo.senderUserID);
    console.log(transactionInfo.senderWalletID);
    console.log(transactionInfo.receiverUserID);
    console.log(transactionInfo.receiverWalletID);
    console.log(transactionInfo.amount);

    //Verifying Receiver information
    const verifyReceiverIDQuery = `SELECT COUNT(*)
                              FROM "FINANCEMANAGER"."AccountInfo"
                              WHERE "UserID" LIKE '${transactionInfo.receiverUserID}'`;
    const verifyReceiverIDQueryResult = await runQuery(verifyReceiverIDQuery);
    const receiverCheck = verifyReceiverIDQueryResult[0][0];
    if (!receiverCheck) {
      console.log("Receiver not found");
    }

    if (
      transactionInfo.senderWalletID > 0 &&
      transactionInfo.senderWalletID <= currentUser.wallets
    ) {
      senderWalletCheck = true;
    }

    if (currentUser.userID == transactionInfo.receiverUserID) {
      sameUserID = true;
    }
    //Transaction Validity
    if (
      currentUser.amounts[transactionInfo.senderWalletID] >=
        transactionInfo.amount &&
      receiverCheck &&
      senderWalletCheck &&
      !sameUserID
    ) {
      const financialIncomeUpdateQuery = `UPDATE "FINANCEMANAGER"."FinancialInfo"
                                            SET "Amount" = "Amount" + ${transactionInfo.amount},
                                            "Last Updated On" = TO_DATE('${transactionDateInput}', 'YYYY-MM-DD HH24-MI-SS')
                                            WHERE "UserID" LIKE '${transactionInfo.receiverUserID}'
                                            AND "WalletID" = ${transactionInfo.receiverWalletID}`;
      const newIncomeInsertQuery = `INSERT INTO "FINANCEMANAGER"."Incomes" VALUES ('${transactionInfo.receiverUserID}', '${newIncomeID}', 
                                     ${transactionInfo.receiverWalletID}, 'Transaction', 
                                     ${transactionInfo.amount}, TO_DATE('${transactionDateInput}', 'YYYY-MM-DD HH24-MI-SS'))`;
      let newIncomeInsertQueryResult = await runQuery(newIncomeInsertQuery);
      let financialIncomeUpdateQueryResult = await runQuery(
        financialIncomeUpdateQuery
      );

      const financialExpenseUpdateQuery = `UPDATE "FINANCEMANAGER"."FinancialInfo"
                                            SET "Amount" = "Amount" - ${transactionInfo.amount},
                                            "Last Updated On" = TO_DATE('${transactionDateInput}', 'YYYY-MM-DD HH24-MI-SS')
                                            WHERE "UserID" LIKE '${currentUser.userID}'
                                            AND "WalletID" = ${transactionInfo.senderWalletID}`;
      const newExpenseInsertQuery = `INSERT INTO "FINANCEMANAGER"."Expenses" VALUES ('${currentUser.userID}', '${newExpenseID}', 
                                      ${transactionInfo.senderWalletID}, 'Transaction', 
                                      ${transactionInfo.amount}, TO_DATE('${transactionDateInput}', 'YYYY-MM-DD HH24-MI-SS'))`;
      let newExpenseInsertQueryResult = await runQuery(newExpenseInsertQuery);
      let financialExpenseUpdateQueryResult = await runQuery(
        financialExpenseUpdateQuery
      );

      //Transaction Query***********************************************************************
      //****************************************************************************************
      const transactionInsertQuery = `INSERT INTO "FINANCEMANAGER"."Transactions" VALUES('${currentUser.userID}', ${transactionInfo.senderWalletID}, 
                                                                                        '${transactionInfo.receiverUserID}', ${transactionInfo.receiverWalletID}, 
                                                                                         TO_DATE('${transactionDateInput}', 'YYYY-MM-DD HH24-MI-SS'), ${transactionInfo.amount})`;
      //Local variable update in the backend
      currentUser.amounts[transactionInfo.senderWalletID] -=
        transactionInfo.amount;
      console.log(currentUser.amounts);
    }
  } else {
    console.log("Sender Wallet Not Found");
  }

  res.redirect("/transaction");
});

module.exports = router;
