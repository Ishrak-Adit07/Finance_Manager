const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const { getSignUpPage, getToCreateAccountPage } = require('../controllers/signup.controller');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const path = require('path');
const { newUserInfo } = require('../models/signup.model');


const dbConnection = require("../dbConnection/dbConnection.js");
const { runQuery } = require("../dbConnection/runFunctions.js");
dbConnection.connect();


router.get("/", getSignUpPage);

router.post("/", async (req, res) =>{
    //Collecting new user data
    newUserInfo.name = req.body.name;
    newUserInfo.mail = req.body.mail;

    let dobString = req.body.dob;
    newUserInfo.dob = Date.parse(dobString);

    newUserInfo.address = req.body.address;
    newUserInfo.job = req.body.job;
    newUserInfo.gender = req.body.gender;

    //Sending to create account page
    res.redirect("/createAccount");
});

module.exports = router;