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

router.get("/", (req, res) => {
  res.render(path.join(__dirname + "/../views/currentStatus.ejs"), {
    currentUser,
  });
});

router.post("/", async (req, res) => {
  res.redirect("/currentStatus");
});

router.post("/addWallet", async (req, res) => {
  console.log("This is from addWallet");
  console.log(currentUser.userID);

  try {
    const addWalletQuery = `BEGIN
                                    NEW_FINANCIAL_INFO(:USERID);
                                END;`;
    const addWalletBinds = {
      USERID: currentUser.userID,
    };

    const result = await runProcedure(addWalletQuery, addWalletBinds);
    currentUser.wallets += 1;
    currentUser.amounts.push(0);
  } catch (error) {
    console.log(error);
    console.error("addWalletQuery Not Executed");
  }

  res.redirect("/currentStatus");
});

router.get("/deleteWallet", (req, res) => {
  res.render(path.join(__dirname + "/../views/deleteWallet.ejs"), {
    currentUser,
  });
});

router.post("/deleteWallet", (req, res) => {
  let walletToBeDeleted = Number(req.body.walletID);
  console.log("Wallet to be deleted: " + walletToBeDeleted);

  res.render(path.join(__dirname + "/../views/currentStatus.ejs"), {
    currentUser,
  });
});

module.exports = router;
