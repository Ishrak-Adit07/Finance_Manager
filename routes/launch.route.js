const express = require('express');
const router = express.Router();
const path = require('path');

const bodyParser = require('body-parser');
const { getLaunchPage } = require('../controllers/launch.controller');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", getLaunchPage);

module.exports = router;