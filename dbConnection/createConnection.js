const oracledb = require('oracledb');

async function runQuery(query) {
    const connection = await oracledb.getConnection({
        user          : "FINANCEMANAGER",
        password      : "fmanager",  // contains the hr schema password
        connectString : "localhost/orclpdb"
    });

    const result = await connection.execute(query);
    console.log("Result is:", result.rows);

    await connection.close();   // Always close connections
}

const tempQuery = `SELECT * FROM "FINANCEMANAGER"."AccountInfo"`;

runQuery(tempQuery);

module.exports = runQuery;