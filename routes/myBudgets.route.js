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
  getExpenseInfoPage,
  saveExpenseInfo,
} = require("../controllers/expenses.controller");
const { getMyBudgetsPage } = require("../controllers/myBudgets.controller");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const path = require("path");
var { currentUser } = require("../models/login.model");
const { runQuery } = require("../dbConnection/runFunctions");
const { currentBudgets } = require("../models/myBudget.model");

router.get("/", async (req, res) => {
  currentUser = req.session.currentUser;
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

  res.render(path.join(__dirname + "/../views/myBudgets.ejs"), {
    currentUser,
    currentBudgets,
  });
});

module.exports = router;
