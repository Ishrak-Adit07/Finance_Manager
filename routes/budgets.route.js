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
const { getBudgetsPage } = require("../controllers/budgets.controller");
let { currentUser } = require("../models/login.model");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const path = require("path");

router.get("/", (req, res) => {
  currentUser = req.session.currentUser;
  res.render(path.join(__dirname + "/../views/budgets.ejs"), { currentUser });
});

module.exports = router;
