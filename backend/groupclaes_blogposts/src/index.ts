'use strict'
import Fastify from '@groupclaes/fastify-elastic'
import { FastifyInstance } from 'fastify'
import { env } from 'process'

import blogspostsController from './controllers/blogspostsController'

const LOGLEVEL = 'debug'

/** Main loop */
export default async function (config: any): Promise<FastifyInstance | undefined> {
  // add jwt configuration object to config
  const fastify = await Fastify({ ...config.wrapper, jwt: {} })
  const version_prefix = (env.APP_VERSION ? '/' + env.APP_VERSION : '')
  console.log(`${version_prefix}/${config.wrapper.serviceName}`)

  fastify.log.level = LOGLEVEL
  await fastify.register(blogspostsController,
    { prefix: `${version_prefix}/${config.wrapper.serviceName}`,
    logLevel: 'debug' })
  await fastify.listen({ port: +(env['PORT'] ?? 80), host: '::' })

  return fastify
}
