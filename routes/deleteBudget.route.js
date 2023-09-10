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
var { currentUser } = require("../models/login.model");
const { currentBudgets } = require("../models/myBudget.model");

const dbConnection = require("../dbConnection/dbConnection.js");
const { runQuery } = require("../dbConnection/runFunctions.js");
dbConnection.connect();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const path = require("path");

router.get("/", (req, res) => {
  currentUser = req.session.currentUser;
  res.render(path.join(__dirname + "/../views/deleteBudget.ejs"), {
    currentUser,
    currentBudgets,
  });
});

router.post("/", async (req, res) => {
  currentUser = req.session.currentUser;
  let deleteBudgetID = Number(req.body.budgetID);

  if (deleteBudgetID <= currentUser.budgets) {
    const deleteBudgetQuery = `DELETE FROM "FINANCEMANAGER"."Budgets"
                               WHERE "UserID" LIKE '${currentUser.userID}'
                               AND "BudgetID" = ${deleteBudgetID}`;
    console.log(deleteBudgetQuery);
    let deleteBudgetQueryResult = await runQuery(deleteBudgetQuery);

    const updateBudgetQuery = `UPDATE "FINANCEMANAGER"."Budgets"
                               SET "BudgetID" = "BudgetID"-1
                               WHERE "BudgetID" > ${deleteBudgetID}`;
    console.log(updateBudgetQuery);
    let updateBudgetQueryResult = await runQuery(updateBudgetQuery);

    const updateBudgetNoQuery = `UPDATE "FINANCEMANAGER"."WalletsInfo"
                                SET "Budgets" = "Budgets"-1
                                WHERE "UserID" LIKE '${currentUser.userID}'`;
    console.log(updateBudgetNoQuery);
    let updateBudgetNoQueryResult = await runQuery(updateBudgetNoQuery);

    currentUser.budgets -= 1;
  }
  res.redirect("/home");
});

module.exports = router;
