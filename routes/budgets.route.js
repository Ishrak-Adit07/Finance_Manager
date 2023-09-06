const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const { getBudgetsPage } = require('../controllers/budgets.controller');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", getBudgetsPage);

module.exports = router;