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

router.post("/", async(req, res)=>{
    deleteWalletInfo.walletID = Number(req.body.walletID);
    console.log("Wallet to be deleted: "+deleteWalletInfo.walletID);
    deleteWalletInfo.shiftWalletID = Number(req.body.shiftWalletID);
    if(deleteWalletInfo.shiftWalletID==null) deleteWalletInfo.shiftWalletID = 0;
    console.log("Shift Wallet: "+deleteWalletInfo.shiftWalletID);

    if(deleteWalletInfo.walletID <= currentUser.wallets && deleteWalletInfo.shiftWalletID <= currentUser.wallets){
        try{
            deleteWalletInfo.amount = currentUser.amounts[deleteWalletInfo.walletID];
            const deleteWalletFromTablesQuery = `BEGIN
                                                    DELETE_WALLET_FROM_TABLES(:USERID, :WALLETID);
                                                 END;`;
            const deleteWalletFromTablesBinds = {
                USERID: currentUser.userID,
                WALLETID: deleteWalletInfo.walletID
            };
    
            const result1 = await runProcedure(deleteWalletFromTablesQuery, deleteWalletFromTablesBinds);

            const updateTablesAfterDeleteWalletQuery = `BEGIN
                                                            UPDATE_TABLES_AFTER_DELETE_WALLET(:USERID, :WALLETID);
                                                        END;`;
            const updateTablesAfterDeleteWalletBinds = {
                USERID: currentUser.userID,
                WALLETID: deleteWalletInfo.walletID
            };
    
            const result2 = await runProcedure(updateTablesAfterDeleteWalletQuery, updateTablesAfterDeleteWalletBinds);
            
            for(var i=deleteWalletInfo.walletID; i<currentUser.wallets; i++){
                currentUser.amounts[i] = currentUser.amounts[i+1];
            }
            currentUser.amounts.pop();
            currentUser.wallets -= 1;

            if(deleteWalletInfo.shiftWalletID > deleteWalletInfo.walletID){
                deleteWalletInfo.shiftWalletID = deleteWalletInfo.shiftWalletID-1;
            }
            const shiftAmountToWalletQuery = `UPDATE "FINANCEMANAGER"."FinancialInfo"
                                              SET "Amount" = "Amount"+${deleteWalletInfo.amount}
                                              WHERE "UserID" LIKE '${currentUser.userID}'
                                              AND "WalletID" = ${deleteWalletInfo.shiftWalletID}`;
            let shiftAmountToWalletQueryResult = await runQuery(shiftAmountToWalletQuery);
            currentUser.amounts[deleteWalletInfo.shiftWalletID] += deleteWalletInfo.amount;
        }catch(error){
            console.log(error);
            console.error("deleteWalletFromTablesQuery/updateTablesAfterDeleteWalletQuery Not Executed");
        }
    }

    res.render(path.join(__dirname+"/../views/currentStatus.ejs"), {currentUser});
});

module.exports = router;