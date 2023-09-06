var { currentUser, loggedPassword } = require("../models/login.model");

const verifyLoginQuery = `SELECT COUNT(*)
                          FROM "FINANCEMANAGER"."AccountInfo"
                          WHERE "UserID" LIKE (SELECT "UserID"
                                               FROM "FINANCEMANAGER"."PersonalInfo"
                                               WHERE "Name" LIKE '${currentUser.name}')
                          AND "Password" LIKE '${loggedPassword}'`;



module.exports = {verifyLoginQuery};