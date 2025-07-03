// External dependencies
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import BirthdaysRepo from '../../repositories/birthday.repository'

export default function(fastify: FastifyInstance) {
  fastify.get('/upcoming', async (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> => {
    const start: number = performance.now()

    try {
      if (!request.jwt?.sub)
        return reply.fail({ jwt: 'missing authorization' }, 401)
      // 'read:GroupClaes.Login'

      const pool = await fastify.getSqlPool()
      const repo = new BirthdaysRepo(request.log, pool)

      const result = await repo.getUpcoming(request.jwt.sub)

      if (result instanceof Error) {
        return reply.error(result.message, undefined, performance.now() - start)
      }

      return reply.fail({ parameters: 'No birthdays found!' }, undefined, performance.now() - start)
    } catch (err) {
      request.log.error({err}, err.message ?? 'Unknown error')
      return reply.error(err.message ?? 'Unknown error', undefined, performance.now() - start)
    }
  })
}
