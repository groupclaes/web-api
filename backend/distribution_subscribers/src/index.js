'use strict'

const Fastify = require('@groupclaes/fastify-elastic')
const config = require('./config')
const routes = require('./routes')

/** Main loop */
const main = async () => {
  const fastify = new Fastify(config.wrapper)
  fastify.routeMultiple(routes)
  await fastify.start()
}

main()