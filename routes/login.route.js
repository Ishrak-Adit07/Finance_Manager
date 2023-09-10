const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");

const session = require("express-session");
router.use(
  session({
    secret: "financemanager",
    resave: false,
    saveUninitialized: true,
  })
);

const bodyParser = require("body-parser");
const { getLogin, verifyLogin } = require("../controllers/login.controller");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const path = require("path");

const dbConnection = require("../dbConnection/dbConnection.js");
dbConnection.connect();
const { runQuery, runFunction } = require("../dbConnection/runFunctions.js");
var { currentUser, loggedPassword } = require("../models/login.model");
const { log } = require("console");
//const { verifyLoginQuery } = require('../queriesAndBinds/login.queries');

router.get("/", getLogin);

router.post("/", async (req, res) => {
  //Collecting log in information
  currentUser.mail = req.body.mail;
  req.session.mail = currentUser.mail; //************** */
  loggedPassword = String(req.body.password);

  //Verifying log in information
  /*
  const verifyLoginQuery = `SELECT COUNT(*)
                              FROM "FINANCEMANAGER"."AccountInfo"
                              WHERE "Mail" LIKE '${currentUser.mail}'
                              AND "Password" LIKE '${loggedPassword}'`;
  const verifyLoginResult = await runQuery(verifyLoginQuery);
  const check = verifyLoginResult[0][0];
  */

  const verifyLoginQuery = `BEGIN
                              :check := VERIFY_LOGIN(:MAIL, :PASS);
                            END;`;
  const verifyLoginQueryBinds = {
    MAIL: currentUser.mail,
    PASS: loggedPassword,
    check: { dir: oracledb.BIND_OUT, type: oracledb.VARCHAR2 },
  };

  const verifyLoginResult = await runFunction(
    verifyLoginQuery,
    verifyLoginQueryBinds
  );
  console.log(verifyLoginResult.outBinds);

  //console.log(check);
  check = verifyLoginResult.outBinds.check;

  if (check == "T") {
    //Getting userid and other information for further use in application
    const getUserIdQuery = `SELECT "UserID"
                                FROM "FINANCEMANAGER"."AccountInfo"
                                WHERE "Mail" LIKE '${currentUser.mail}'`;
    const userIdQueryResult = await runQuery(getUserIdQuery);
    console.log(userIdQueryResult);
    currentUser.userID = userIdQueryResult[0][0];
    req.session.userID = currentUser.userID; //****************** */

    //Age and Name require
    const getAgeQuery = `SELECT "DateOfBirth", ROUND(MONTHS_BETWEEN(SYSDATE, "DateOfBirth")/12, 0), "Name"
                            FROM "FINANCEMANAGER"."PersonalInfo"
                            WHERE "UserID" LIKE (SELECT "UserID"
										                            FROM "FINANCEMANAGER"."AccountInfo"
										                            WHERE "Mail" LIKE '${currentUser.mail}')`;
    const getAgeQueryResult = await runQuery(getAgeQuery);

    currentUser.dob = getAgeQueryResult[0][0];
    currentUser.age = getAgeQueryResult[0][1];
    currentUser.name = getAgeQueryResult[0][2];
    req.session.name = currentUser.name; //***************** */
    req.session.age = currentUser.age; //******************** */
    req.session.dob = currentUser.dob; //******************** */

    //Collecting number of wallets the user owns
    let walletCountQuery = `SELECT "Wallets"
                            FROM "FINANCEMANAGER"."WalletsInfo"
                            WHERE "UserID" LIKE (SELECT "UserID"
										                            FROM "FINANCEMANAGER"."AccountInfo"
										                            WHERE "Mail" LIKE '${currentUser.mail}')`;
    let walletCountQueryResult = await runQuery(walletCountQuery);
    currentUser.wallets = walletCountQueryResult[0][0];
    req.session.wallets = currentUser.wallets; //****************** */
    for (var i = 1; i <= currentUser.wallets; i++) {
      currentUser.amounts.push(0);
    }

    //Collecting number of budgets the user owns
    let budgetCountQuery = `SELECT "Budgets"
                            FROM "FINANCEMANAGER"."WalletsInfo"
                            WHERE "UserID" LIKE (SELECT "UserID"
										                            FROM "FINANCEMANAGER"."AccountInfo"
										                            WHERE "Mail" LIKE '${currentUser.mail}')`;
    let budgetCountQueryResult = await runQuery(budgetCountQuery);
    currentUser.budgets = budgetCountQueryResult[0][0];
    req.session.budgets = currentUser.budgets; //**********************/

    //Collecting existing amount of money in each wallet of the user as he/she logs in
    const collectAmountsInWalletsQuery = `SELECT "WalletID", "Amount"
                                              FROM "FINANCEMANAGER"."FinancialInfo"
                                              WHERE "UserID" LIKE (SELECT "UserID"
										                                               FROM "FINANCEMANAGER"."AccountInfo"
										                                               WHERE "Mail" LIKE '${currentUser.mail}')`;
    let collectAmountsInWalletsQueryResult = await runQuery(
      collectAmountsInWalletsQuery
    );
    for (var i = 0; i < currentUser.wallets; i++) {
      currentUser.amounts[collectAmountsInWalletsQueryResult[i][0]] =
        collectAmountsInWalletsQueryResult[i][1];
    }
    req.session.amounts = currentUser.amounts; //***************************/
    req.session.currentUser = currentUser;

    //Then we enter home page of application
    res.redirect("/home");
  } else res.redirect("/login");
});

module.exports = router;
