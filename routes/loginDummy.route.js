const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const { getLogin, verifyLogin } = require("../controllers/login.controller");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const path = require("path");

const dbConnection = require("../dbConnection/dbConnection.js");
dbConnection.connect();
const { runQuery } = require("../dbConnection/runFunctions.js");
var { currentUser, loggedPassword } = require("../models/login.model");
//const { verifyLoginQuery } = require('../queriesAndBinds/login.queries');

router.get("/", getLogin);

router.post("/", async (req, res) => {
  //Collecting log in information
  currentUser.mail = req.body.mail;
  console.log(currentUser.mail);
  loggedPassword = String(req.body.password);
  console.log(loggedPassword);

  //Verifying log in information
  const verifyLoginQuery = `SELECT COUNT(*)
                              FROM "FINANCEMANAGER"."AccountInfo"
                              WHERE "Mail" LIKE '${currentUser.mail}'
                              AND "Password" LIKE '${loggedPassword}'`;

  //console.log(verifyLoginQuery);
  const verifyLoginResult = await runQuery(verifyLoginQuery);
  const check = verifyLoginResult[0][0];

  if (check) {
    //Getting userid and other information for further use in application
    const getUserIdQuery = `SELECT "UserID"
                                FROM "FINANCEMANAGER"."AccountInfo"
                                WHERE "Mail" LIKE '${currentUser.mail}'`;
    const userIdQueryResult = await runQuery(getUserIdQuery);
    console.log("This is from localfunction");
    console.log(userIdQueryResult);
    currentUser.userID = userIdQueryResult[0][0];

    //Age and Name require
    const getAgeQuery = `SELECT "DateOfBirth", ROUND(MONTHS_BETWEEN(SYSDATE, "DateOfBirth")/12, 0), "Name"
                            FROM "FINANCEMANAGER"."PersonalInfo"
                            WHERE "UserID" LIKE '${currentUser.userID}'`;
    const getAgeQueryResult = await runQuery(getAgeQuery);
    console.log("This is from localfunction");
    console.log(getAgeQueryResult);
    currentUser.dob = getAgeQueryResult[0][0];
    currentUser.age = getAgeQueryResult[0][1];
    currentUser.name = getAgeQueryResult[0][2];

    //Collecting number of wallets the user owns
    let walletCountQuery = `SELECT "Wallets"
                                FROM "FINANCEMANAGER"."WalletsInfo"
                                WHERE "UserID" LIKE '${currentUser.userID}'`;
    let walletCountQueryResult = await runQuery(walletCountQuery);
    currentUser.wallets = walletCountQueryResult[0][0];
    console.log(currentUser.wallets);
    for (var i = 1; i <= currentUser.wallets; i++) {
      currentUser.amounts.push(0);
    }

    //Collecting number of budgets the user owns
    let budgetCountQuery = `SELECT "Budgets"
                            FROM "FINANCEMANAGER"."WalletsInfo"
                            WHERE "UserID" LIKE '${currentUser.userID}'`;
    let budgetCountQueryResult = await runQuery(budgetCountQuery);
    currentUser.budgets = budgetCountQueryResult[0][0];
    console.log(currentUser.budgets);
    for (var i = 1; i <= currentUser.budgets; i++) {
      //currentUser.amounts.push(0);
    }

    //Collecting existing amount of money in each wallet of the user as he/she logs in
    const collectAmountsInWalletsQuery = `SELECT "WalletID", "Amount"
                                              FROM "FINANCEMANAGER"."FinancialInfo"
                                              WHERE "UserID" LIKE '${currentUser.userID}'`;
    let collectAmountsInWalletsQueryResult = await runQuery(
      collectAmountsInWalletsQuery
    );
    for (var i = 0; i < currentUser.wallets; i++) {
      currentUser.amounts[collectAmountsInWalletsQueryResult[i][0]] =
        collectAmountsInWalletsQueryResult[i][1];
    }

    //Then we enter home page of application
    res.redirect("/home");
  } else res.redirect("/login");
});

module.exports = router;
