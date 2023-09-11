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
const {
  getCurrentStatusPage,
  saveCurrentStatus,
} = require("../controllers/currentStatus.controller");
const { runQuery, runProcedure } = require("../dbConnection/runFunctions");
var { currentUser } = require("../models/login.model");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const path = require("path");
const { currentJointAccounts } = require("../models/jointAccounts.model");

router.get("/", async(req, res) => {
    const getMyBudgetInfosQuery = `SELECT * FROM "FINANCEMANAGER"."Budgets"
                                   WHERE "UserID" LIKE '${currentUser.userID}'`;
  let getMyBudgetInfosQueryResult = await runQuery(getMyBudgetInfosQuery);

  const getJointAccountsQuery = `SELECT * FROM "FINANCEMANAGER"."JointAccounts"
                                 WHERE "UserID1" LIKE '${currentUser.userID}'
                                 OR "UserID2" LIKE '${currentUser.userID}'
                                 OR "UserID3" LIKE '${currentUser.userID}'
                                 OR "UserID4" LIKE '${currentUser.userID}'
                                 OR "UserID5" LIKE '${currentUser.userID}'`;
    let getJointAccountsQueryResult = await runQuery(getJointAccountsQuery);

    currentJointAccounts.length = 0;
    for(var i in getJointAccountsQueryResult){
        let param1 = getJointAccountsQueryResult[i][1];
        let param2 = getJointAccountsQueryResult[i][2];
        let param3 = getJointAccountsQueryResult[i][3];
        let param4 = getJointAccountsQueryResult[i][4];
        let param5 = getJointAccountsQueryResult[i][5];
        let param6 = getJointAccountsQueryResult[i][6];
        let param7 = getJointAccountsQueryResult[i][7];
        let param8 = getJointAccountsQueryResult[i][8];

        let currJointAccount = { param1, param2, param3, param4, param5, param6, param7, param8};
        currentJointAccounts.push(currJointAccount);
    }

  res.render(path.join(__dirname + "/../views/jointAccounts.ejs"), {
    currentJointAccounts,
  });
});

router.post("/", async (req, res) => {
  
});
module.exports = router;
