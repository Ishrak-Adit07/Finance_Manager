const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const { getBudgetsPage } = require("../controllers/budgets.controller");
let { currentUser } = require("../models/login.model");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const path = require("path");

router.get("/", (req, res) => {
  res.render(path.join(__dirname + "/../views/budgets.ejs"), { currentUser });
});

module.exports = router;
