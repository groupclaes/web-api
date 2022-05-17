'use strict'

const Fastify = require('@groupclaes/fastify-elastic')
const handle = require('@groupclaes/fastify-authhandler')
const config = require('./config')
const routes = require('./routes')

const main = async () => {
  const fastify = new Fastify(config.wrapper)
  fastify.addAuthPreHandler(handle, 'token')
  fastify.routeMultiple(routes)
  await fastify.start()
}

main()