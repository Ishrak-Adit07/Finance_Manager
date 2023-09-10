const express = require("express");
const router = express.Router();

const session = require("express-session");
router.use(
  session({
    secret: "financemanager",
    resave: false,
    saveUninitialized: true,
  })
);
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const path = require("path");
var { currentUser } = require("../models/login.model");
const { runQuery } = require("../dbConnection/runFunctions");

router.post("/", async (req, res) => {
  currentUser = req.session.currentUser;
  const deleteAccountQuery = `DELETE FROM "FINANCEMANAGER"."AccountInfo"
                                WHERE "UserID" LIKE '${currentUser.userID}'`;
  let deleteAccountQueryResult = await runQuery(deleteAccountQuery);

  res.render(path.join(__dirname + "/../views/launch.ejs"));
});

module.exports = router;
