const express = require("express");
const router = express.Router();

const path = require("path");
var { currentUser } = require("../models/login.model");

const dbConnection = require("../dbConnection/dbConnection.js");
const { runQuery } = require("../dbConnection/runFunctions.js");
dbConnection.connect();

const bodyParser = require("body-parser");
const {
  getCreateAccountPage,
  verifySignUp,
} = require("../controllers/createAccount.controller");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", (req, res)=>{
    res.render(path.join(__dirname + "/../views/createJointAcccount.ejs"), {currentUser});
});

router.post("/", async (req, res) => {
  let userid1 = req.body.userid1;
  let userid2 = req.body.userid2;
  let userid3 = req.body.userid3;
  let userid4 = req.body.userid4;
  let initialAmount = Number(req.body.initialAmount);

    //Verifying Receiver information
    const verifyReceiverID1Query = `SELECT COUNT(*)
                                    FROM "FINANCEMANAGER"."AccountInfo"
                                    WHERE "UserID" LIKE '${userid1}'`;
    const verifyReceiverID1QueryResult = await runQuery(verifyReceiverID1Query);
    const receiver1Check = verifyReceiverID1QueryResult[0][0];
    if (!receiver1Check) {
        console.log("UserID 1 not found");
    }

    const verifyReceiverID2Query = `SELECT COUNT(*)
                                    FROM "FINANCEMANAGER"."AccountInfo"
                                    WHERE "UserID" LIKE '${userid2}'`;
    const verifyReceiverID2QueryResult = await runQuery(verifyReceiverID2Query);
    const receiver2Check = verifyReceiverID2QueryResult[0][0];
    if (!receiver2Check) {
        console.log("UserID 2 not found");
    }

    const verifyReceiverID3Query = `SELECT COUNT(*)
                                    FROM "FINANCEMANAGER"."AccountInfo"
                                    WHERE "UserID" LIKE '${userid3}'`;
    const verifyReceiverID3QueryResult = await runQuery(verifyReceiverID3Query);
    const receiver3Check = verifyReceiverID3QueryResult[0][0];
    if (!receiver3Check) {
        console.log("UserID 3 not found");
    }

    const verifyReceiverID4Query = `SELECT COUNT(*)
                                    FROM "FINANCEMANAGER"."AccountInfo"
                                    WHERE "UserID" LIKE '${userid4}'`;
    const verifyReceiverID4QueryResult = await runQuery(verifyReceiverID4Query);
    const receiver4Check = verifyReceiverID4QueryResult[0][0];
    if (!receiver4Check) {
        console.log("UserID 4 not found");
    }

  //Inserting new user into appropraite tables
  if (!receiver1Check) {
    //Constructing date object for input
    const dobObject = new Date(newUserInfo.dob);
    let year = dobObject.getFullYear();
    let month = dobObject.getMonth();
    let dt = dobObject.getDate();
    let hr = dobObject.getHours();
    let mm = dobObject.getMinutes();
    let ss = dobObject.getSeconds();
    let dobInput = String(
      year + "-" + month + "-" + dt + " " + hr + "-" + mm + "-" + ss
    );
    console.log(dobInput);
    currentUser.dob = dobInput;

    let insertJointAccountQuery;
    if(receiver2Check && !receiver3Check && !receiver4Check){
        insertJointAccountQuery = `INSERT INTO "FINANCEMANAGER"."JointAccounts" VALUES ('${userid1}', '${userid2}')`;
    }
    if(receiver2Check && receiver3Check && !receiver4Check){
        insertJointAccountQuery = `INSERT INTO "FINANCEMANAGER"."JointAccounts" VALUES ('${userid1}', '${userid2}', '${userid3}')`;
    }
    if(receiver2Check && receiver3Check && receiver4Check){
        insertJointAccountQuery = `INSERT INTO "FINANCEMANAGER"."JointAccounts" VALUES ('${userid1}', '${userid2}', '${userid3}', '${userid4}')`;
    }

    let insertJointAccountQueryResult = await runQuery(insertJointAccountQuery);

    //Required queries
    const insertNewUserIntoAccountInfoQuery = `INSERT INTO "FINANCEMANAGER"."AccountInfo" VALUES ('${newUserInfo.username}', 
                                                    '${newUserInfo.mail}', '${newPassword}')`;
    const insertNewUserIntoPersonalInfoQuery = `INSERT INTO "FINANCEMANAGER"."PersonalInfo" VALUES 
                                                    ('${newUserInfo.username}', TO_DATE('${dobInput}', 'YYYY-MM-DD HH24-MI-SS'), 
                                                    '${newUserInfo.gender}', '${newUserInfo.job}', 
                                                    '${newUserInfo.address}', '${newUserInfo.name}')`;
    const insertNewUserIntoWalletsInfoQuery = `INSERT INTO "FINANCEMANAGER"."WalletsInfo" VALUES ('${newUserInfo.username}', 0, 0)`;

    res.redirect("/home");
  } else {
    console.log("At least 2 users required");
    res.render(path.join(__dirname + "/../views/jointAccounts.ejs"), {});
  }
});

module.exports = router;
