--CreateAccount.route.js
const insertNewUserIntoAccountInfoQuery = `INSERT INTO "FINANCEMANAGER"."AccountInfo" VALUES ('${newUserInfo.username}', 
                                                    '${newUserInfo.mail}', '${newPassword}')`;
const insertNewUserIntoPersonalInfoQuery = `INSERT INTO "FINANCEMANAGER"."PersonalInfo" VALUES 
                                                    ('${newUserInfo.username}', TO_DATE('${dobInput}', 'YYYY-MM-DD HH24-MI-SS'), 
                                                    '${newUserInfo.gender}', '${newUserInfo.job}', 
                                                    '${newUserInfo.address}', '${newUserInfo.name}')`;
const insertNewUserIntoWalletsInfoQuery = `INSERT INTO "FINANCEMANAGER"."WalletsInfo" VALUES ('${newUserInfo.username}', 0, 0)`;
