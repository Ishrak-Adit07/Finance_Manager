const path = require('path');
var { currentUser } = require('../models/login.model');

const dbConnection = require("../dbConnection/dbConnection.js");
const { runQuery } = require("../dbConnection/runFunctions.js");
dbConnection.connect();

exports.getLogin = (req, res) =>{
    res.render(path.join(__dirname+"/../views/login.ejs"), {});
};

exports.verifyLogin = (req, res) =>{
    currentUser.name = req.body.username;
    console.log(currentUser.name);
    currentUser.userID = "lazybird428";
    console.log(currentUser.userID);

    const verifyUniqueUserID = `SELECT COUNT(*)
                                FROM "FINANCEMANAGER"."AccountInfo"
                                WHERE "UserID" LIKE '${currentUser.userID}'`;

    const isUniqueID = localRunFunction(verifyUniqueUserID);
    console.log(isUniqueID);

    res.redirect("/home");
}

async function localRunFunction(query){
    const result = await runQuery(query);
    console.log("This is from localFunction");
    console.log(result[0][0]);

    if(result[0][0] > 0) return false;
    else return true;
}
