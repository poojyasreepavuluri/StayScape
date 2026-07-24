const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE,
    waitForConnections : true,
    connectionLimit : 10,
    queueLimit : 0
});

pool.getConnection((err,connection) =>{
    if(err){
        console.error("MY SQL Connection Failed:",err.message);
        return;
    }
    console.log('MYSQL CONNECTED SUCCESSFULLY...');
    connection.release();
});

module.exports = pool.promise();