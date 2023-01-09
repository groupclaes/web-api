'use strict'

const sql = require('mssql')
const db = require('../db')

exports.getDashboard = async (user_id) => {
  try {
    const request = new sql.Request(await db.get('distribution'))
    request.input('user_id', sql.Int, user_id)
    const result = await request.query(`EXEC usp_getAnalyticsDashboard @user_id`)

    if (result.recordsets.length == 7) {
      return {
        uniqueVisitors: {
          data: result.recordsets[0]
        },
        activeUsers: {
          data: result.recordsets[1],
          card: result.recordsets[2]
        },
        impressions: {
          data: result.recordsets[3],
          card: result.recordsets[4]
        },
        registrations: {
          data: result.recordsets[5],
          card: result.recordsets[6]
        }
      }
    }
    throw new Error('yeet')
  } catch (err) {
    throw err
  }
}