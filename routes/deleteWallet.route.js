const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const { runQuery, runProcedure } = require('../dbConnection/runFunctions');
var { currentUser } = require('../models/login.model');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const path = require('path');
const { deleteWalletInfo } = require('../models/deleteInfo.model');

router.get("/", (req, res)=>{
    res.render(path.join(__dirname+"/../views/deleteWallet.ejs"), {currentUser});
});

router.post("/", (req, res)=>{
    deleteWalletInfo.walletID = Number(req.body.walletID);
    console.log("Wallet to be deleted: "+deleteWalletInfo.walletID);

    deleteWalletInfo.amount = currentUser.amounts[deleteWalletInfo.walletID];
    console.log(deleteWalletInfo.amount);

    res.render(path.join(__dirname+"/../views/currentStatus.ejs"), {currentUser});
});

module.exports = router;