import Fastify from '@groupclaes/fastify-elastic'
import { FastifyInstance } from 'fastify'
import { env } from 'process'

import profileController from './controllers/profile/controller'
const LOGLEVEL = 'debug'

export default async function(config: any): Promise<FastifyInstance | undefined> {
  if (!config || !config.wrapper) return
  if (!config.wrapper.mssql && config.mssql) config.wrapper.mssql = config.mssql

  const fastify = await Fastify({ ...config.wrapper })
  const version_prefix = '/api' + (env.APP_VERSION ? '/' + env.APP_VERSION : '') + '/profile'

  fastify.log.level = LOGLEVEL
  await fastify.register(profileController, { prefix: `${version_prefix}`, logLevel: LOGLEVEL })
  await fastify.listen({ port: +(env['PORT'] ?? 80), host: '::' })
  return fastify
}
