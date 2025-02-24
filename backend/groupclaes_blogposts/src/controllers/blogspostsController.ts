// External dependencies
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import sql from 'mssql'

import BlogPostRepository from '../repositories/blogpostRepository'
import PCMRepository from '../repositories/pcmRepository'

declare module 'fastify' {
  export interface FastifyInstance {
    getSqlPool: (name?: string) => Promise<sql.ConnectionPool>
  }

  export interface FastifyReply {
    success: (data?: any, code?: number, executionTime?: number) => FastifyReply
    fail: (data?: any, code?: number, executionTime?: number) => FastifyReply
    error: (message?: string, code?: number, executionTime?: number) => FastifyReply
  }
}


export default async function (fastify: FastifyInstance) {
  fastify.get('/:id?', async (request: FastifyRequest<{
    Params: {
      id: number
    },
    Querystring: {
      page: number,
      itemCount: number,
      company: string,
      type: number,
      token: string
    }
  }>, reply: FastifyReply) => {
    const pcmRepo = new PCMRepository(request.log,
      await fastify.getSqlPool('pcm'))
    const blogRepo = new BlogPostRepository(request.log,
      await fastify.getSqlPool('sapphire'), pcmRepo)

    try {
      const id = +request.params.id
  
      const page = request.query.page || 0
      const itemCount = request.query.itemCount || 24
      const company = request.query.company || 'dis'
      const type = request.query.type || 1
      const token = request.query.token
  
      request.log.info({ page, itemCount, company, type, token, blogpostId: id }, 'Retrieving blogposts')
  
      const blogposts = await blogRepo.get(id, { page, itemCount, company, type, token })
      if (blogposts != null) {
        if (blogposts.verified) {
          return blogposts
        }
      }
  
      return reply
        .fail({ verified: false, error: 'Wrong credentials' }, 403)
    } catch (err) {
        request.log.error(JSON.stringify(err), 'Something went wrong')
        return reply
        .error('Something went wrong', 500,)
    }
  })

  return fastify
}
