const path = require('path');

exports.getLaunchPage = (req, res)=>{
    res.render(path.join(__dirname+"/../views/launch.ejs"), {});
}