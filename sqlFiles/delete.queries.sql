--deleteAccount.route.js
DELETE FROM "FINANCEMANAGER"."AccountInfo"
WHERE "UserID" LIKE '${currentUser.userID}';

--deleteBudget.route.js
DELETE FROM "FINANCEMANAGER"."Budgets"
WHERE "UserID" LIKE '${currentUser.userID}'
AND "BudgetID" = ${deleteBudgetID};


--deleteWallet.route.js
DELETE FROM "FINANCEMANAGER"."FinancialInfo"
WHERE "UserID" LIKE '${currentUser.userID}'
AND "WalletID" = ${deleteWalletInfo.walletID}

BEGIN
DELETE_WALLET_FROM_TABLES(:USERID, :WALLETID);
END;

