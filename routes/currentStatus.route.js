const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const { getCurrentStatusPage, saveCurrentStatus } = require('../controllers/currentStatus.controller');
const { runQuery, runProcedure } = require('../dbConnection/runFunctions');
var { currentUser } = require('../models/login.model');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", getCurrentStatusPage);

router.post("/", async(req, res)=>{
    res.redirect("/currentStatus");
});

router.post("/addWallet", async(req, res)=>{
    console.log("This is from addWallet");
    console.log(currentUser.userID);
    
    try{
        const addWalletQuery = `BEGIN
                                    NEW_FINANCIAL_INFO(:USERID);
                                END;`;
        const addWalletBinds = {
            USERID: currentUser.userID
        };

        const result = await runProcedure(addWalletQuery, addWalletBinds);
        currentUser.wallets += 1;
        currentUser.amounts.push(0);
    }catch(error){
        console.log(error);
        console.error("addWalletQuery Not Executed");
    }

    res.redirect("/currentStatus");
});

module.exports = router;