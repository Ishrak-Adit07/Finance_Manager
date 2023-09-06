const path = require('path');
var { currentUser } = require('../models/login.model');

exports.getBudgetsPage = (req, res) =>{
    res.render(path.join(__dirname+"/../views/budgets.ejs"), {currentUser});
};
