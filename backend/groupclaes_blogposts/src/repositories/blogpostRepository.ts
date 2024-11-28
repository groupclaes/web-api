import { GenericTranslation } from '../models/genericTranslation';
import sql from 'mssql'
import { FastifyBaseLogger } from 'fastify'
import PCMRepository, { PCMImageMeta } from './pcmRepository'

export default class BlogPostRepository {
  _pcm: PCMRepository
  _logger: FastifyBaseLogger
  _pool: sql.ConnectionPool

  constructor(logger: FastifyBaseLogger, pool: sql.ConnectionPool, pcm: PCMRepository) {
    this._logger = logger
    this._pool = pool
    this._pcm = pcm
  }

  async get(id: number, params: any) {
    try {
      const request = new sql.Request(this._pool)
  
      if (id) {
        request.input('id', sql.Int, id)
        request.input('token', sql.UniqueIdentifier, params.token)
        const result = await request.execute('GetBlogPost')
        if (!result || !result.recordset) {
          return null
        }
  
        const { error, verified } = result.recordset[0]
        const recordSetLength = result.recordsets.length as number
  
        if (error) {
          return { error, verified }
        } else if (result && recordSetLength > 0) {
          const resp = {
            error,
            verified,
            result: (recordSetLength > 1 ? result.recordsets[1][0] : []) as BlogPost[],
            extra_results: (recordSetLength > 2 ? result.recordsets[2][0] : []) as BlogPost[]
          }
          await this.addMeta(resp)
          return resp
        }
        
        return null
      }
  
      request.input('page', sql.Int, params.page)
      request.input('itemCount', sql.Int, params.itemCount)
      request.input('company', sql.VarChar, params.company)
      request.input('type', sql.TinyInt, params.type)
  
      const result = await request.execute(`GetBlogPosts`)
      const recordSetLength = result.recordsets.length as number
      return {
        error: result.recordset[0].e,
        verified: result.recordset[0].v,
        result: (recordSetLength > 1 ? result.recordsets[1][0] : []) as BlogPost[]
      }
    } catch (err) {
      throw err
    }
  }
  
  async addMeta(blogposts) {
    if (blogposts.verified) {
      // get meta info for all blogposts
      for (let i = 0; i < blogposts.result.length; i++) {
        await this.factory(blogposts.result[i])
      }
      // get meta info for all extra results
      for (let i = 0; i < blogposts.extra_results.length; i++) {
        await this.factory(blogposts.extra_results[i])
      }
    }
  }

  async factory(blogpost: BlogPost) {
    if (!blogpost.image)
      return
    if (this._pcm) {
      if (blogpost.image.indexOf('{lang}') > -1 && blogpost.image.indexOf('/{lang}') === -1) {
        blogpost.image = blogpost.image.replace('{lang}', '/{lang}')
      }
      const image = blogpost.image.replace(/https\:\/\/pcm\.groupclaes\.be\/v([0-9].*)\/(i|content)\//, '')
        .replace('{lang}', '')
        .replace('?', '')
      const params = image.split('/')
      if (params.length >= 4) {
        const metas = await this._pcm.getMetaInformation({
          company: params[0],
          objectType: params[1],
          documentType: params[2],
          objectId: +params[3]
        })

        if (metas && metas.length > 0) {
          blogpost.meta = metas[0]
        }
      }
    }
  }
}

export interface BlogPost {
  id: number
  title: GenericTranslation
  description: GenericTranslation
  ctaText: GenericTranslation
  company: number
  image: string
  icon: string
  type: number
  meta: PCMImageMeta
}
