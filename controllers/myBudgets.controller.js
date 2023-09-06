const path = require('path');
var { currentUser } = require('../models/login.model');

exports.getMyBudgetsPage = (req, res) =>{
    res.render(path.join(__dirname+"/../views/myBudgets.ejs"), {currentUser});
};
