'use strict'

const Fastify = require('@groupclaes/fastify-elastic')
const config = require('./config')
const routes = require('./routes')

const main = async () => {
  const fastify = new Fastify(config.wrapper)
  fastify.routeMultiple(routes)
  fastify.server.addHook('preHandler', (request, reply, next) => {
    reply.header('Content-Security-Policy', `nosniff`)
    reply.header('X-Content-Type-Options', `default-src 'none'`)
    reply.header('X-Frame-Options', `DENY`)
    reply.header('X-Xss-Protection', `1; mode=block`)
    reply.header('Referrer-Policy', `no-referrer`)
    reply.header('Permissions-Policy', `fullscreen=*`)
    reply.header('Strict-Transport-Security', `max-age=15552000; preload`)
    next()
  })
  await fastify.start()
}

main()