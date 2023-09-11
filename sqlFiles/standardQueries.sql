--login.route.js
BEGIN
:check := VERIFY_LOGIN(:MAIL, :PASS);
END;

SELECT "UserID"
FROM "FINANCEMANAGER"."AccountInfo"
WHERE "Mail" LIKE '${currentUser.mail}'

SELECT "DateOfBirth", ROUND(MONTHS_BETWEEN(SYSDATE, "DateOfBirth")/12, 0), "Name"
FROM "FINANCEMANAGER"."PersonalInfo"
WHERE "UserID" LIKE (SELECT "UserID"
FROM "FINANCEMANAGER"."AccountInfo"
WHERE "Mail" LIKE '${currentUser.mail}')

SELECT "Wallets"
FROM "FINANCEMANAGER"."WalletsInfo"
WHERE "UserID" LIKE (SELECT "UserID"
FROM "FINANCEMANAGER"."AccountInfo"
WHERE "Mail" LIKE '${currentUser.mail}')

SELECT "Budgets"
FROM "FINANCEMANAGER"."WalletsInfo"
WHERE "UserID" LIKE (SELECT "UserID"
FROM "FINANCEMANAGER"."AccountInfo"
WHERE "Mail" LIKE '${currentUser.mail}')

SELECT "WalletID", "Amount"
FROM "FINANCEMANAGER"."FinancialInfo"
WHERE "UserID" LIKE (SELECT "UserID"
FROM "FINANCEMANAGER"."AccountInfo"
WHERE "Mail" LIKE '${currentUser.mail}'

--myBudget.route.js
SELECT * FROM "FINANCEMANAGER"."Budgets"
WHERE "UserID" LIKE '${currentUser.userID}'

--newBudget.route.js
SELECT "Budgets"
FROM "FINANCEMANAGER"."WalletsInfo"
WHERE "UserID" LIKE '${currentUser.userID}'


--shiftWallet.route.js
BEGIN
:shiftCheck := SHIFT_MONEY(:ID, :SRC, :AMOUNT);
END;


--signup.route.js
SELECT COUNT(*)
FROM "FINANCEMANAGER"."AccountInfo"
WHERE "Mail" LIKE '${newUserInfo.mail}'


--transaction.route.js
SELECT COUNT(*)
FROM "FINANCEMANAGER"."AccountInfo"
WHERE "UserID" LIKE '${transactionInfo.receiverUserID}'

--login.controller.js
SELECT COUNT(*)
FROM "FINANCEMANAGER"."AccountInfo"
WHERE "UserID" LIKE '${currentUser.userID}'