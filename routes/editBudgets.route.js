const express = require('express');
const router = express.Router();
const path = require('path');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var { currentUser } = require('../models/login.model');
const { runQuery } = require('../dbConnection/runFunctions');
const { currentBudgets } = require('../models/myBudget.model');

router.get("/", (req, res)=>{
    res.render(path.join(__dirname+"/../views/editBudgets.ejs"), {currentUser, currentBudgets});
});

module.exports = router;