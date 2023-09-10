const express = require("express");
const router = express.Router();
const path = require("path");

const session = require("express-session");
router.use(
  session({
    secret: "financemanager",
    resave: false,
    saveUninitialized: true,
  })
);

const bodyParser = require("body-parser");
const { getLaunchPage } = require("../controllers/launch.controller");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", getLaunchPage);

module.exports = router;
