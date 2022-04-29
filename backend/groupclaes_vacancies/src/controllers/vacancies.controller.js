/** External imports */
const boom = require('boom')
const { FastifyRequest, FastifyReply } = require('fastify')

/** Internal imports */
const Vacancy = require('../models/vacancy.model')

/**
 * Get a list of open vacancies
 * @param {FastifyRequest} request 
 * @param {FastifyReply} reply 
 */
exports.get = async (request, reply) => {
  try {
    const vacancies = await Vacancy.get()

    if (vacancies) {
      return {
        result: vacancies,
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