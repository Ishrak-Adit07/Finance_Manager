const oracledb = require('oracledb');

let connection = null;

async function connect(){
    if(connection)
        return connection;

    else{
        connection = await oracledb.getConnection({
            user: "FINANCEMANAGER",
            password: "fmanager",
            connectionString: "localhost/orclpdb"
        });
        return connection;
    }
}

function getConnection(){
    return connection;
}

async function closeConnection(){
    if(connection){
        await connection.close();
        connection = null;
    }
}

module.exports = {connect, getConnection, closeConnection};