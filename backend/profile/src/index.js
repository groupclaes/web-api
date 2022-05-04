'use strict'

const Fastify = require('@groupclaes/fastify-elastic')
const config = require('./config')
const { routes } = require('./routes')
const { handle } = require('./auth.handler')

/** Main loop */
const main = async () => {
  const fastify = new Fastify(config.wrapper)
  fastify.server.decorateRequest('token', '')
  fastify.addAuthPreHandler(handle)
  fastify.routeMultiple(routes)
  await fastify.start()
}

main()