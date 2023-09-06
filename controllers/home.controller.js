const path = require('path');
var { currentUser } = require('../models/login.model');

exports.getHomeMenu = (req, res) =>{
    res.render(path.join(__dirname+"/../views/home.ejs"), {currentUser});
};