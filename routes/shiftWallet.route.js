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
var { currentUser } = require("../models/login.model");
const { runQuery, runFunction } = require("../dbConnection/runFunctions");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const path = require("path");

router.get("/", (req, res) => {
  res.render(path.join(__dirname + "/../views/shiftWallet.ejs"), {
    currentUser,
  });
});

router.post("/", async (req, res) => {
  let shiftFromWalletID = Number(req.body.shiftFromWalletID);
  let shiftToWalletID = Number(req.body.shiftToWalletID);
  let shiftAmount = Number(req.body.shiftAmount);

  const shiftCheckQuery = `BEGIN
                              :shiftCheck := SHIFT_MONEY(:ID, :SRC, :AMOUNT);
                            END;`;
  const shiftCheckQueryBinds = {
    ID: currentUser.userID,
    SRC: shiftFromWalletID,
    AMOUNT: shiftAmount,
    shiftCheck: { dir: oracledb.BIND_OUT, type: oracledb.VARCHAR2 },
  };

  const shiftCheckQueryResult = await runFunction(
    shiftCheckQuery,
    shiftCheckQueryBinds
  );
  console.log(shiftCheckQueryResult.outBinds);

  //console.log(check);
  shiftCheck = shiftCheckQueryResult.outBinds.shiftCheck;

  if (shiftCheck == "T") {
    const shiftFromWalletQuery = `UPDATE "FINANCEMANAGER"."FinancialInfo"
                                    SET "Amount" = "Amount" - ${shiftAmount},
                                    "Last Updated On" = SYSDATE
                                    WHERE "UserID" LIKE '${currentUser.userID}'
                                    AND "WalletID" = ${shiftFromWalletID}`;
    let shiftFromWalletQueryResult = await runQuery(shiftFromWalletQuery);

    const shiftToWalletQuery = `UPDATE "FINANCEMANAGER"."FinancialInfo"
                                    SET "Amount" = "Amount" + ${shiftAmount},
                                    "Last Updated On" = SYSDATE
                                    WHERE "UserID" LIKE '${currentUser.userID}'
                                    AND "WalletID" = ${shiftToWalletID}`;
    let shiftToWalletQueryResult = await runQuery(shiftToWalletQuery);

    currentUser.amounts[shiftFromWalletID] -= shiftAmount;
    currentUser.amounts[shiftToWalletID] += shiftAmount;
  }
  res.redirect("/home");
});

module.exports = router;
