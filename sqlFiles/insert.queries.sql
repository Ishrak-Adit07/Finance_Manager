--CreateAccount.route.js
INSERT INTO "FINANCEMANAGER"."AccountInfo" VALUES ('${newUserInfo.username}', 
'${newUserInfo.mail}', '${newPassword}');

INSERT INTO "FINANCEMANAGER"."PersonalInfo" VALUES 
('${newUserInfo.username}', TO_DATE('${dobInput}', 'YYYY-MM-DD HH24-MI-SS'), 
'${newUserInfo.gender}', '${newUserInfo.job}', 
'${newUserInfo.address}', '${newUserInfo.name}');

INSERT INTO "FINANCEMANAGER"."WalletsInfo" VALUES ('${newUserInfo.username}', 0, 0);

--incomes.route.js
INSERT INTO "FINANCEMANAGER"."Expenses" VALUES ('${currentUser.userID}', '${newExpenseID}', 
${newExpenseInfo.wallet}, '${newExpenseInfo.type}', 
${newExpenseInfo.amount}, SYSDATE)


--newBudget.route.js
INSERT INTO "FINANCEMANAGER"."Budgets" VALUES
('${currentUser.userID}', ${currentUser.budgets}, '${newBudgetInfo.purpose}',
${newBudgetInfo.amount}, 0, ${newBudgetInfo.amount}, SYSDATE, SYSDATE)


--transaction.route.js
INSERT INTO "FINANCEMANAGER"."Incomes" VALUES ('${transactionInfo.receiverUserID}', '${newIncomeID}', 
${transactionInfo.receiverWalletID}, 'Transaction', 
${transactionInfo.amount}, SYSDATE)

INSERT INTO "FINANCEMANAGER"."Expenses" VALUES ('${currentUser.userID}', '${newExpenseID}', 
${transactionInfo.senderWalletID}, 'Transaction', 
${transactionInfo.amount}, SYSDATE)

INSERT INTO "FINANCEMANAGER"."Transactions" VALUES('${currentUser.userID}', ${transactionInfo.senderWalletID}, 
'${transactionInfo.receiverUserID}', ${transactionInfo.receiverWalletID}, 
TO_DATE('${transactionDateInput}', 'YYYY-MM-DD HH24-MI-SS'), ${transactionInfo.amount})