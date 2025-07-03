// External dependencies
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import birthdayController from './birthday.controller'
import ProfilesRepo from '../../repositories/profile.repository'

export default function(fastify: FastifyInstance) {
  fastify.register(birthdayController, { prefix: '/birthdays' })

  fastify.get('', (request: FastifyRequest<{
    Params: { user_id?: string }
  }>, reply: FastifyReply) => getProfile(fastify, request, reply))
  fastify.get('/:user_id', (request: FastifyRequest<{
    Params: { user_id: string }
  }>, reply: FastifyReply) => getProfile(fastify, request, reply))

  fastify.get('/avatar/:hash', async (request: FastifyRequest<{ Params: { hash: string } }>, reply: FastifyReply) => {
    const start: number = performance.now()
    const hash = request.params.hash || undefined

    try {
      const pool = await fastify.getSqlPool()
      const repo = new ProfilesRepo(request.log, pool)
      if (hash) {
        const avatarBytes = await repo.getAvatar(hash)
        if (avatarBytes) {
          return reply
            .code(200)
            .header('Content-disposition', 'attachment; filename=avatar-' + hash + '.png')
            .header('Cache-Control', `public, max-age=7200, must-revalidate`)
            .type('image/png')
            .send(avatarBytes)
        }
        return reply.code(404)
          .send({
            statusCode: 404,
            status: 'Not Found!',
            message: 'Avatar is missing for user'
          })
      }
      return reply
        .code(400)
        .send({
          statusCode: 400,
          status: 'Bad request!',
          message: 'parameter hash is missing!'
        })
    } catch (err) {
      request.log.error({ err }, err.message ?? 'Unknown error')
      return reply.error(err.message ?? 'Unknown error', undefined, performance.now() - start)
    }
  })

  fastify.get('/team', async (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> => {
    const start: number = performance.now()

    try {
      if (!request.jwt?.sub)
        return reply.fail({ jwt: 'missing authorization' }, 401)
      // 'read:GroupClaes.Login'

      const pool = await fastify.getSqlPool()
      const repo = new ProfilesRepo(request.log, pool)

      const result = await repo.getTeam(request.jwt.sub)

      return reply.success({ team: { member: result.members } }, undefined, performance.now() - start)
    } catch (err) {
      throw err
    }
  })
}

async function getProfile(fastify: FastifyInstance, request: FastifyRequest<{
  Params: { user_id?: string }
}>, reply: FastifyReply): Promise<FastifyReply> {
  const start: number = performance.now()
  const uuid: string = request.params.user_id

  try {
    if (!request.jwt?.sub)
      return reply.fail({ jwt: 'missing authorization' }, 401)
    // 'read:GroupClaes.Login'

    const pool = await fastify.getSqlPool()
    const repo = new ProfilesRepo(request.log, pool)

    const result = await repo.get(request.jwt.sub, uuid)

    if (result.profile)
      return reply.success({ profile: result.profile }, undefined, performance.now() - start)

    return reply.fail({ parameters: 'No birthdays found!' }, undefined, performance.now() - start)
  } catch (err) {
    request.log.error({ err }, err.message ?? 'Unknown error')
    return reply.error(err.message ?? 'Unknown error', undefined, performance.now() - start)
  }
}
