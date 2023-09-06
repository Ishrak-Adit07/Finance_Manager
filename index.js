const app = require("./app");
const PORT = 4000;

app.listen(PORT, (req, res)=>{
    console.log(`Server is running at http://localhost:${PORT}/launch`);
});