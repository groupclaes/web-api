const sql = require('mssql')
const config = require('../config')

const conn = new sql.ConnectionPool(config.mssql.pcm)
  .connect()
  .then(pool => pool)

exports.getMetaInformation = async (company, objecttype, documenttype, objectid) => {
  const pool = await conn
  const request = new sql.Request(pool)

  request.input('company', sql.VarChar, company)
  request.input('objecttype', sql.VarChar, objecttype)
  request.input('documenttype', sql.VarChar, documenttype)
  request.input('objectid', sql.BigInt, objectid)

  const result = await request.query(`EXEC GetMetaInformation @company, @objecttype, @documenttype, @objectid`)
  // return {
  //   error: result.recordset[0].e,
  //   verified: result.recordset[0].v,
  //   result: result.recordsets[1][0]
  // }
  return result.recordset[0]
}