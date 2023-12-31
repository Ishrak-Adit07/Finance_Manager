const express = require("express");
const app = express();

//For using ejs
app.set("view engine", "ejs");
//Static public
app.use(express.static("public"));

const session = require("express-session");
app.use(
  session({
    secret: "financemanager",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());

const path = require("path");
path.join(__dirname + "/dbConnection/dbConnection.js");
const dbConnection = require(path.join(
  __dirname + "/dbConnection/dbConnection.js"
));
dbConnection.connect();

const launchRouter = require(path.join(__dirname + "/routes/launch.route.js"));
app.use("/launch", launchRouter);

const loginRouter = require(path.join(__dirname + "/routes/login.route.js"));
app.use("/login", loginRouter);

const signupRouter = require(path.join(__dirname + "/routes/signup.route.js"));
app.use("/signup", signupRouter);

const createAccountRouter = require(path.join(
  __dirname + "/routes/createAccount.route.js"
));
app.use("/createAccount", createAccountRouter);

const homeMenuRouter = require(path.join(__dirname + "/routes/home.route.js"));
app.use("/home", homeMenuRouter);

const newIncomeRouter = require(path.join(
  __dirname + "/routes/incomes.route.js"
));
app.use("/newIncomeInfo", newIncomeRouter);

const newExpenseRouter = require(path.join(
  __dirname + "/routes/expenses.route.js"
));
app.use("/newExpenseInfo", newExpenseRouter);

const currentStatusRouter = require(path.join(
  __dirname + "/routes/currentStatus.route.js"
));
app.use("/currentStatus", currentStatusRouter);

const budgtesRouter = require(path.join(
  __dirname + "/routes/budgets.route.js"
));
app.use("/budgets", budgtesRouter);

const newBudgetRouter = require(path.join(
  __dirname + "/routes/newBudget.route.js"
));
app.use("/newBudget", newBudgetRouter);

const myBudgetsRouter = require(path.join(
  __dirname + "/routes/myBudgets.route.js"
));
app.use("/myBudgets", myBudgetsRouter);

const deleteWalletRouter = require(path.join(
  __dirname + "/routes/deleteWallet.route.js"
));
app.use("/deleteWallet", deleteWalletRouter);

const editBudgetsRouter = require(path.join(
  __dirname + "/routes/editBudgets.route.js"
));
app.use("/editBudgets", editBudgetsRouter);

const myProfileRouter = require(path.join(
  __dirname + "/routes/myProfile.route.js"
));
app.use("/myProfile", myProfileRouter);

const deleteAccountRouter = require(path.join(
  __dirname + "/routes/deleteAccount.route.js"
));
app.use("/deleteAccount", deleteAccountRouter);

const transactionRouter = require(path.join(
  __dirname + "/routes/transaction.route.js"
));
app.use("/transaction", transactionRouter);

const deleteBudgetRouter = require(path.join(
  __dirname + "/routes/deleteBudget.route.js"
));
app.use("/deleteBudget", deleteBudgetRouter);

const jointAccountsRouter = require(path.join(
  __dirname + "/routes/jointAccounts.route.js"
));
app.use("/jointAccounts", jointAccountsRouter);

const createJointAccountRouter = require(path.join(
  __dirname + "/routes/createJointAccount.route.js"
));
app.use("/createJointAccount", createJointAccountRouter);

const shiftWalletRouter = require(path.join(
  __dirname + "/routes/shiftWallet.route.js"
));
app.use("/shiftWallet", shiftWalletRouter);

const logoutRouter = require(path.join(__dirname + "/routes/logout.route.js"));
app.use("/logout", logoutRouter);

app.use((req, res) => {
  res.send("Wrong URL");
});

module.exports = app;
