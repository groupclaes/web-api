'use strict'

const Fastify = require('@groupclaes/fastify-elastic')
const config = require('./config')
const routes = require('./routes')
const { handle } = require('./auth.handler')

const main = async () => {
  const fastify = new Fastify(config.wrapper)
  fastify.addAuthPreHandler(handle, 'token')
  fastify.server.register(require('fastify-multipart'))
  fastify.routeMultiple(routes)
  await fastify.start()
}

main()