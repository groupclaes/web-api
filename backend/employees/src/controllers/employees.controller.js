// External dependencies
const boom = require('boom')
const Employee = require('../models/employee.model')
const { FastifyRequest, FastifyReply } = require('fastify')
const { JwtPayload } = require('jsonwebtoken')

/**
 * Get 
 * @route GET /
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 */
exports.get = async (request, reply) => {
  try {
    /** @type {JwtPayload} */
    const applicationId = +request.params.id ?? 3

    const employees = await Employee.get(0, applicationId)

    if (employees.verified) {
      return employees
    }
    return reply
      .status(401)
      .send({ verified: false, error: 'Wrong credentials' })
  } catch (err) {
    throw boom.boomify(err)
  }
}