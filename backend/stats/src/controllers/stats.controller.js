// External dependencies
const boom = require('boom')
const { FasifyRequest, FasifyReply } = require('fastify')

const Stat = require('../models/stat.model')

/**
 * @desc Get statName
 * @route /stats/:statName
 * @param {FasifyRequest} request
 * @param {FasifyReply} reply
 */
exports.get = async (request, reply) => {
  try {
    const statName = request.params.name

    if (Stat[statName]) {
      const stat = await Stat[statName]()
      if (stat) return stat
    }

    return reply
      .code(404)
      .send()
  } catch (err) {
    throw boom.boomify(err)
  }
}