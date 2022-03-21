'use strict'

const Fastify = require('@groupclaes/fastify-elastic')
const config = require('./config')
const routes = require('./routes')

const main = async () => {
  const fastify = new Fastify(config.wrapper)
  fastify.routeMultiple(routes, false)
  await fastify.start()
}

main()