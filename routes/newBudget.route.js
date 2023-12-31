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
  getNewBudgetPage,
  saveNewBudget,
} = require("../controllers/newBudget.controller");
var newBudgetInfo = require("../models/newCashInfo.model.js");
var { currentUser } = require("../models/login.model");
const { runQuery } = require("../dbConnection/runFunctions");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.render(path.join(__dirname + "/../views/newBudget.ejs"), { currentUser });
});

router.post("/", async (req, res) => {
  newBudgetInfo.amount = Number(req.body.amount);
  newBudgetInfo.purpose = String(req.body.purpose);

  console.log(newBudgetInfo.amount);
  console.log(newBudgetInfo.purpose);

  const budgetDateObject = new Date();
  let year = budgetDateObject.getFullYear();
  let month = budgetDateObject.getMonth();
  let dt = budgetDateObject.getDate();
  let hr = budgetDateObject.getHours();
  let mm = budgetDateObject.getMinutes();
  let ss = budgetDateObject.getSeconds();
  let budgetDateInput = String(
    year + "-" + month + "-" + dt + " " + hr + "-" + mm + "-" + ss
  );
  console.log(budgetDateInput);

  let budgetCountQuery = `SELECT "Budgets"
                            FROM "FINANCEMANAGER"."WalletsInfo"
                            WHERE "UserID" LIKE '${currentUser.userID}'`;
  let budgetCountQueryResult = await runQuery(budgetCountQuery);
  currentUser.budgets = budgetCountQueryResult[0][0];
  currentUser.budgets += 1;

  const updateBudgetCountQuery = `UPDATE "FINANCEMANAGER"."WalletsInfo"
                                    SET "Budgets" = ${currentUser.budgets}
                                    WHERE "UserID" LIKE '${currentUser.userID}'`;
  let updateBudgetCountQueryResult = await runQuery(updateBudgetCountQuery);

  const insertNewBudgetQuery = `INSERT INTO "FINANCEMANAGER"."Budgets" VALUES
                                 ('${currentUser.userID}', ${currentUser.budgets}, '${newBudgetInfo.purpose}',
                                 ${newBudgetInfo.amount}, 0, ${newBudgetInfo.amount}, SYSDATE, SYSDATE)`;
  let insertNewBudgetQueryResult = await runQuery(insertNewBudgetQuery);

  res.redirect("/newBudget");
});

module.exports = router;

//UserID, BudgetID, BudgetName, Amount, Spent, Left, Created On, Last Updated On
