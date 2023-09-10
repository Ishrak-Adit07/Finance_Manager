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

var { currentUser } = require("../models/login.model");

const path = require("path");

router.get("/", async (req, res) => {
  res.render(path.join(__dirname + "/../views/myProfile.ejs"), { currentUser });
});

module.exports = router;
