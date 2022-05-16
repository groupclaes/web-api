'use strict'

const oe = require('@groupclaes/oe-connector')
const { FastifyRequest, FastifyReply } = require('fastify')
const boom = require('boom')

const config = require('../config')

/**
 * Retrieve phonebook from OE (gnsw100b)
 * @param {FastifyRequest} request 
 * @param {FastifyReply} reply 
 */
exports.getPhonebook = (request, reply) => {
  try {
    oe.configure(config.oeConnector)

    const oeResponse = await oe.run('gnsw100b', [
      user,
      company,
      undefined
    ])

    if (oeResponse && oeResponse.status === 200) {
      if (oeResponse.result) {
        return {
          result: oeResponse.result
        }
      } else {
        return reply
          .code(204)
          .send()
      }
    }

    return reply
      .code(oeResponse.status)
      .send(oeResponse)
  } catch (err) {
    throw boom.boomify(err)
  }
}