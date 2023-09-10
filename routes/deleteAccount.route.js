const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const path = require('path');
var { currentUser } = require('../models/login.model');
const { runQuery } = require('../dbConnection/runFunctions');

router.post("/", async(req, res)=>{
    const deleteAccountQuery = `DELETE FROM "FINANACEMANAGER"."AccountInfo"
                                WHERE "UserID" LIKE '${currentUser.userID}'`;
    let deleteAccountQueryResult = await runQuery(deleteAccountQuery);

    res.render(path.join(__dirname+"/../views/launch.ejs"));
});

module.exports = router;