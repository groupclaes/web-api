const oe = require('@groupclaes/oe-connector')
const { FastifyRequest, FastifyReply } = require('fastify')
const config = require('../config')

/**
 * 
 * @param {FastifyRequest} request 
 * @param {FastifyReply} reply 
 * @returns 
 */
exports.post = async (request, reply) => {
  const test = req.query.test == true

  if (test) {
    return reply
      .code(502)
      .send()
  }

  oe.configure(config.oeConnector)

  const oeResponse = await oe
    .run('postAppOrder', [
      'brabopak',
      'BRA',
      999333999,
      0,
      request.body,
      undefined
    ])

  if (oeResponse && oeResponse.status === 200) {
    if (oeResponse.result) {
      return oeResponse.result
    } else {
      return reply
        .code(204)
        .send()
    }
  }

  return reply
    .code(oeResponse.status)
    .send(oeResponse)
}