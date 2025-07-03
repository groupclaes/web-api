import { FastifyBaseLogger } from 'fastify'
import * as sql from 'mssql'

export default class Birthdays {
  // schema: string = 'ecommerce.'
  _logger: FastifyBaseLogger
  _pool: sql.ConnectionPool

  constructor(logger: FastifyBaseLogger, pool: sql.ConnectionPool) {
    this._logger = logger
    this._pool = pool
  }

  async getUpcoming (user_id: string) {
    try {
      const request = new sql.Request(this._pool)
      const result = await request.execute(`GetUpcommingBirthdays`)

      const { error, verified } = result.recordset[0]
      if (verified) {
        return {
          error,
          verified,
          birthdays: result.recordsets[1]
        }
      } else {
        return new Error(error)
      }
    } catch (err) {
      throw err
    }
  }
}
