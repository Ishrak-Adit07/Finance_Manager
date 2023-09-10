const express = require("express");
const router = express.Router();

const path = require("path");
var { currentUser } = require("../models/login.model");
var { newUserInfo } = require("../models/signup.model.js");

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

router.get("/", getCreateAccountPage);

router.post("/", async (req, res) => {
  //Fetching username and password
  currentUser.userID = newUserInfo.username = req.body.username;
  console.log(currentUser.userID);
  let newPassword = req.body.password;
  console.log(newPassword);

  //Verifying if userid is unique
  const verifyUniqueUseridQuery = `SELECT COUNT(*)
                                     FROM "FINANCEMANAGER"."AccountInfo"
                                     WHERE "UserID" LIKE '${currentUser.userID}'`;
  const uniqueIdResult = await runQuery(verifyUniqueUseridQuery);
  console.log("This is from localFunction");
  const checkUniqueUser = uniqueIdResult[0][0];
  console.log(checkUniqueUser);

  //Inserting new user into appropraite tables
  if (!checkUniqueUser) {
    currentUser.name = newUserInfo.name;
    currentUser.wallets = 0;
    currentUser.budgets = 0;
    console.log(newUserInfo.name);
    console.log(newUserInfo.mail);

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

    console.log(newUserInfo.address);
    console.log(newUserInfo.job);
    console.log(newUserInfo.gender);
    console.log(newUserInfo.username);

    //Required queries
    const insertNewUserIntoAccountInfoQuery = `INSERT INTO "FINANCEMANAGER"."AccountInfo" VALUES ('${newUserInfo.username}', 
                                                    '${newUserInfo.mail}', '${newPassword}')`;
    const insertNewUserIntoPersonalInfoQuery = `INSERT INTO "FINANCEMANAGER"."PersonalInfo" VALUES 
                                                    ('${newUserInfo.username}', TO_DATE('${dobInput}', 'YYYY-MM-DD HH24-MI-SS'), 
                                                    '${newUserInfo.gender}', '${newUserInfo.job}', 
                                                    '${newUserInfo.address}', '${newUserInfo.name}')`;
    const insertNewUserIntoWalletsInfoQuery = `INSERT INTO "FINANCEMANAGER"."WalletsInfo" VALUES ('${newUserInfo.username}', 0, 0)`;

    //Requried insert operations
    let insertResultAccountInfo = await runQuery(
      insertNewUserIntoAccountInfoQuery
    );
    let insertResultPersonalInfo = await runQuery(
      insertNewUserIntoPersonalInfoQuery
    );
    let insertResultWalletsInfo = await runQuery(
      insertNewUserIntoWalletsInfoQuery
    );

    //Logging in
    res.redirect("/home");
  } else {
    let message = "Username not allowed";
    res.render(path.join(__dirname + "/../views/createAccount.ejs"), {});
  }
});

module.exports = router;
//
