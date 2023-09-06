const dbConnection = require("./dbConnection.js");
dbConnection.connect();

var { currentUser } = require('../models/login.model');

async function runQuery(query){
    const connection = dbConnection.getConnection();

    try{
        const result = await connection.execute(query);
        await connection.commit();
        /*
        console.log("This is from dbConnection");
        console.log(result.rows);
        */
        return result.rows;
    }catch(error){
        console.error(`Query not executed`, error);
        throw error;
    }
}

async function runProcedure(query, params){
    const connection = dbConnection.getConnection();

    try{
        const result = await connection.execute(query, params);
        await connection.commit();

        return result.rows;
    }catch(error){
        console.error(`Procedure not executed`, error);
        throw error;
    }
}

async function runFunction(query, params){
    const connection = dbConnection.getConnection();

    try{
        const result = await connection.execute(query, params);
        return result.rows;
    }catch(error){
        console.error(`Function not executed`, error);
        throw error;
    }
}

module.exports = {runQuery, runProcedure, runFunction};