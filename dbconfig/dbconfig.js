const mysql = require('mysql2/promise')

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'commsult_tpm',
  connectionLimit: 100,
  supportBigNumbers: true,
  bigNumberStrings: true
}

const pool = mysql.createPool(config)

module.exports = pool