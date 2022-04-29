/** External imports */
const boom = require('boom')
const { FastifyRequest, FastifyReply } = require('fastify')

/** Internal imports */
const ClientMap = require('../models/client-map.model')

/**
 * Get client-map
 * @param {FastifyRequest} request 
 * @param {FastifyReply} reply 
 */
exports.get = async (request, reply) => {
  const old = request.query.old === 'true'
  try {
    const clientMap = ClientMap.get(request.query.company ?? 'GRO', old)

    if (clientMap) {
      return {
        result: clientMap,
        error: null,
        verified: false
      }
    } else {
      return reply
        .code(404)
        .send()
    }
  } catch (err) {
    throw boom.boomify(err)
  }
}