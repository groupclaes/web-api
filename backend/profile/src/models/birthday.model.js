const sql = require('mssql')
const db = require('../db')

exports.getUpcomming = async (user_id) => {
  try {
    const request = new sql.Request(await db.get('sapphire'))
    const result = await request.query(`EXEC GetUpcommingBirthdays`)

    const { error, verified } = result.recordset[0]
    if (verified) {
      return {
        error,
        verified,
        birthdays: result.recordsets[1]
      }
    } else {
      throw new Error(error)
    }
  } catch (err) {
    throw err
  }
}