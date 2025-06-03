const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'mysql',
  user: 'root',
  password: 'admin123',
  database: 'todolist'
});


module.exports = pool.promise();