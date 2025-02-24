import { GenericTranslation } from './../models/genericTranslation';
import sql from 'mssql'
import { FastifyBaseLogger } from 'fastify'

export default class PCMRepository {
  _logger: FastifyBaseLogger
  _pool: sql.ConnectionPool

  constructor(logger: FastifyBaseLogger, pool: sql.ConnectionPool) {
    this._logger = logger
    this._pool = pool
  }

  async getMetaInformation({ company, objectType, documentType, objectId }: PCMMetadata): Promise<PCMImageMeta[]> {
    const request = new sql.Request(this._pool)

    request.input('company', sql.VarChar, company)
    request.input('objecttype', sql.VarChar, objectType)
    request.input('documenttype', sql.VarChar, documentType)
    request.input('objectid', sql.BigInt, objectId)
  
    const result = await request.execute(`GetMetaInformation`)
    // return {
    //   error: result.recordset[0].e,
    //   verified: result.recordset[0].v,
    //   result: result.recordsets[1][0]
    // }
    return result.recordset[0]
  }
}

export interface PCMMetadata {
  company: string
  objectType: string
  documentType: string
  objectId: number
}

export interface PCMImageMeta {
  id: number
  altText: GenericTranslation
  title: GenericTranslation
}
