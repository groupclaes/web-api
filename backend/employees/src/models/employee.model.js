const sql = require('mssql')
const db = require('../db')

exports.get = async (user_id, application_id) => {
  try {
    const request = new sql.Request(await db.get('sapphire'))
    request.input('user_id', sql.Int, user_id)
    request.input('application_id', sql.Int, application_id)
    const result = await request.query(`EXEC uspGetEmployees @user_id, @application_id`)

    const { error, verified } = result.recordset[0]
    if (verified) {
      return {
        error,
        verified,
        result: result.recordsets.length > 1 ? result.recordsets[1][0] : []
      }
    }
    throw new Error(error)
  } catch (err) {
    throw err
  }
}