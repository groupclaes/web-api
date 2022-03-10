const sql = require('mssql')
const { poolAsync } = require('../db')

exports.get = async (id, params) => {
  try {
    const pool = await poolAsync
    const request = new sql.Request(pool)

    if (id) {
      request.input('id', sql.Int, id)

      const result = await request.query(`EXEC GetBlogPost @id`)
      if (result && result.recordsets.length > 0) {
        return {
          error: result.recordset[0].e,
          verified: result.recordset[0].v,
          result: result.recordsets[1][0] || []
        }
      }
    }

    request.input('page', sql.Int, params.page)
    request.input('itemCount', sql.Int, params.itemCount)
    request.input('company', sql.VarChar, params.company)
    request.input('type', sql.TinyInt, params.type)

    const result = await request.query(`EXEC GetBlogPosts @page, @itemCount, @company, @type`)
    return {
      error: result.recordset[0].e,
      verified: result.recordset[0].v,
      result: result.recordsets[1][0] || []
    }
  } catch (err) {
    throw err
  }
}