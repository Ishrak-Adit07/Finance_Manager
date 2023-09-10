const express = require("express");
const router = express.Router();
const path = require("path");

const session = require("express-session");
router.use(
  session({
    secret: "financemanager",
    resave: false,
    saveUninitialized: true,
  })
);

const bodyParser = require("body-parser");
const { getHomeMenu } = require("../controllers/home.controller");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var { currentUser } = require("../models/login.model");
const { runQuery } = require("../dbConnection/runFunctions.js");
const { recentActivities } = require("../models/home.model");

router.get("/", async (req, res) => {
  currentUser = req.session.currentUser;
  const maxRowNumber = 10;
  /*
  const recentActivitiesQuery = `SELECT * FROM (SELECT * 
                                                  FROM "FINANCEMANAGER"."Incomes"
                                                  WHERE "UserID" LIKE '${currentUser.userID}'
                                                  ORDER BY "Date" DESC)
                                   WHERE ROWNUM <=  ${maxRowNumber}
                                   UNION
                                   SELECT * FROM (SELECT * 
                                                  FROM "FINANCEMANAGER"."Expenses"
                                                  WHERE "UserID" LIKE '${currentUser.userID}'
                                                  ORDER BY "Date" DESC)
                                   WHERE ROWNUM <= ${maxRowNumber}`;
  */
  const recentActivitiesQuery = `SELECT * FROM (SELECT * FROM (SELECT * 
                                                FROM "FINANCEMANAGER"."Incomes"
                                                WHERE "UserID" LIKE 'wincheng')
                                                UNION
                                                SELECT * FROM (SELECT * 
                                                FROM "FINANCEMANAGER"."Expenses"
                                                WHERE "UserID" LIKE 'wincheng'))
                                WHERE ROWNUM <= 10
                                ORDER BY "Date" ASC`;
  let recentActivitiesQueryResult = await runQuery(recentActivitiesQuery);

  recentActivities.length = 0;
  for (var i in recentActivitiesQueryResult) {
    let param1 = recentActivitiesQueryResult[i][1];
    let param2 = recentActivitiesQueryResult[i][2];
    let param3 = recentActivitiesQueryResult[i][3];
    let param4 = recentActivitiesQueryResult[i][4];
    let param5 = String(recentActivitiesQueryResult[i][5]);
    param5 = param5.substring(0, 25);
    let param6 = String(param1);
    param6 = param6.substring(0, 3);
    if (param6 == "inc") param6 = "Income";
    else param6 = "Expense";

    const activity = { param1, param2, param3, param4, param5, param6 };
    recentActivities.push(activity);
  }

  res.render(path.join(__dirname + "/../views/home.ejs"), {
    currentUser,
    recentActivities,
  });
});

module.exports = router;
