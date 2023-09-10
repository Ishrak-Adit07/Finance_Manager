const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const path = require('path');

router.get("/", async(req, res)=>{
    res.render(path.join(__dirname+"/../views/myProfile.ejs"), {currentUser});
});

module.exports = router;