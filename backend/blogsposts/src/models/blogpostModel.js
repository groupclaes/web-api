const sql = require('mssql')
const db = require('../db')

exports.get = async (id, params) => {
  try {
    const request = new sql.Request(await db.get('sapphire'))

    if (id) {
      request.input('id', sql.Int, id)
      let sqlCommand = `EXEC GetBlogPost @id`

      if (params.token) {
        sqlCommand += `, @token`
        request.input('token', sql.UniqueIdentifier, params.token)
      }

      const result = await request.query(sqlCommand)
      const { error, verified } = result.recordset[0]

      if (error) {
        return { error, verified}
      } else if (result && result.recordsets.length > 0) {
        return {
          error,
          verified,
          result: result.recordsets.length > 1 ? result.recordsets[1][0] : [],
          extra_results: result.recordsets.length > 2 ? result.recordsets[2][0] : []
        }
      }
      return reply
        .code(500)
        .send()
    }

    request.input('page', sql.Int, params.page)
    request.input('itemCount', sql.Int, params.itemCount)
    request.input('company', sql.VarChar, params.company)
    request.input('type', sql.TinyInt, params.type)

    const result = await request.query(`EXEC GetBlogPosts @page, @itemCount, @company, @type`)
    return {
      error: result.recordset[0].e,
      verified: result.recordset[0].v,
      result: result.recordsets.length > 1 ? result.recordsets[1][0] : []
    }
  } catch (err) {
    throw err
  }
}