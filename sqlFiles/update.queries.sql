--deleteBudget.route.js
UPDATE "FINANCEMANAGER"."Budgets"
SET "BudgetID" = "BudgetID"-1
WHERE "BudgetID" > ${deleteBudgetID};

UPDATE "FINANCEMANAGER"."WalletsInfo"
SET "Budgets" = "Budgets"-1
WHERE "UserID" LIKE '${currentUser.userID}';


--deleteWallet.route.js
BEGIN
UPDATE_TABLES_AFTER_DELETE_WALLET(:USERID, :WALLETID);
END;

UPDATE "FINANCEMANAGER"."FinancialInfo"
SET "Amount" = "Amount"+${deleteWalletInfo.amount}
WHERE "UserID" LIKE '${currentUser.userID}'
AND "WalletID" = ${deleteWalletInfo.shiftWalletID}

--editBudget.route.js
UPDATE "FINANCEMANAGER"."Budgets"
SET "Amount" = ${editBudgetInfo.totalAmountUpdate},
"Last Updated On" = SYSDATE
WHERE "UserID" LIKE '${currentUser.userID}'
AND "BudgetID" = ${editBudgetInfo.budgetID}

UPDATE "FINANCEMANAGER"."Budgets"
SET "Spent" = "Spent" + ${editBudgetInfo.addToSpent},
"Left" = "Left" - ${editBudgetInfo.addToSpent},
"Last Updated On" = SYSDATE
WHERE "UserID" LIKE '${currentUser.userID}'
AND "BudgetID" = ${editBudgetInfo.budgetID};

UPDATE "FINANCEMANAGER"."Budgets"
SET "Spent" = "Spent" - ${editBudgetInfo.saveFromSpent}, 
"Left" = "Left" + ${editBudgetInfo.saveFromSpent},
"Last Updated On" = SYSDATE
WHERE "UserID" LIKE '${currentUser.userID}'
AND "BudgetID" = ${editBudgetInfo.budgetID}

--incomes.route.js
UPDATE "FINANCEMANAGER"."FinancialInfo"
SET "Amount" = "Amount" + ${newIncomeInfo.amount},
"Last Updated On" = SYSDATE
WHERE "UserID" LIKE '${currentUser.userID}'
AND "WalletID" = ${newIncomeInfo.wallet}

--newBudget.route.js
UPDATE "FINANCEMANAGER"."WalletsInfo"
WHERE "UserID" LIKE '${currentUser.userID}'


--shiftWallet.route.js
UPDATE "FINANCEMANAGER"."FinancialInfo"
SET "Amount" = "Amount" - ${shiftAmount},
"Last Updated On" = SYSDATE
WHERE "UserID" LIKE '${currentUser.userID}'
AND "WalletID" = ${shiftFromWalletID};

UPDATE "FINANCEMANAGER"."FinancialInfo"
SET "Amount" = "Amount" + ${shiftAmount},
"Last Updated On" = SYSDATE
WHERE "UserID" LIKE '${currentUser.userID}'
AND "WalletID" = ${shiftToWalletID};

--transaction.route.js
UPDATE "FINANCEMANAGER"."FinancialInfo"
SET "Amount" = "Amount" + ${transactionInfo.amount},
"Last Updated On" = SYSDATE
WHERE "UserID" LIKE '${transactionInfo.receiverUserID}'
AND "WalletID" = ${transactionInfo.receiverWalletID}

UPDATE "FINANCEMANAGER"."FinancialInfo"
SET "Amount" = "Amount" - ${transactionInfo.amount},
"Last Updated On" = SYSDATE
WHERE "UserID" LIKE '${currentUser.userID}'
AND "WalletID" = ${transactionInfo.senderWalletID}

