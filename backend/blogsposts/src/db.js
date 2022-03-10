const sql = require('mssql')
const config = require('./config')

exports.poolAsync = new sql.ConnectionPool(config.mssql.sapphire)
  .connect()
  .then(pool => pool)