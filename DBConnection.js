//Initiate connection with database
const mysql = require('mysql');

function newConnection()
{
    let connection = mysql.createConnection({
        host:'34.132.7.5',
        user: 'root',
        password:'mypassword',
        database:'doodleDB'
    });
    return connection;
}
module.exports = newConnection;