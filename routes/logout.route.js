const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/logout", (req, res)=>{
    res.render(path.join(__dirname+"/../views/launch.ejs"), {});
})

module.exports = router;