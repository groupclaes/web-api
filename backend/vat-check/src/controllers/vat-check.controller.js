// External deps
const boom = require('boom')
const { FastifyRequest, FastifyReply } = require('fastify')
const { JwtPayload } = require('jsonwebtoken')
const validate = require('validate-vat')

/**
 * Get all access log entries from DB
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 */
exports.get = async (request, reply) => {
  try {
    /** @type {JwtPayload} */
    const token = request.token || { sub: null }
    const query = request.query

    resp = await new Promise((resolve, reject) => {
      validate(query.cc, query.vat, function (err, validationInfo) {
        if (err) {
          reject(err)
        }
        resolve(validationInfo)
      })
    })

    return resp
  } catch (err) {
    throw boom.boomify(err)
  }
}