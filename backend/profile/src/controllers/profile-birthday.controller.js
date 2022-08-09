// External dependencies
const boom = require('boom')
const Birthday = require('../models/birthday.model')
const { FastifyRequest, FastifyReply } = require('fastify')

/**
 * Get most upcomming birthdays (top 4)
 * @route GET /profile/birthdays/upcomming
 * @param {FastifyRequest} req
 * @param {FastifyReply} reply
 */
exports.getUpcomming = async (request, reply) => {
  try {
    /** @type {JwtPayload} */
    const token = request.token
    return await Birthday.getUpcomming(token.sub)
  } catch (err) {
    throw boom.boomify(err)
  }
}