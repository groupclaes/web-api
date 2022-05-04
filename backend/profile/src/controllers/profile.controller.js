// External Dependancies
const boom = require('boom')
const Profile = require('../models/profile.model')
const { FastifyRequest, FastifyReply } = require('fastify')
const { JwtPayload } = require('jsonwebtoken')

/**
 * Get profile
 * @route GET /profile
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 */
exports.get = async (request, reply) => {
  try {
    /** @type {JwtPayload} */
    const token = request.token
    return Profile.get(token.sub)
  } catch (err) {
    throw boom.boomify(err)
  }
}

/**
 * Get avatar picture for userPrincipalNameHash
 * @route GET /profile/avatar/:hash
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 */
exports.getAvatar = async (request, reply) => {
  try {
    const hash = request.params.hash

    if (hash) {
      const avatarBytes = await Profile.getAvatar(hash)
      if (avatarBytes) {
        return reply
          .code(200)
          .header('Content-disposition', 'attachment; filename=avatar-' + hash + '.png')
          .type('image/png')
          .send(avatarBytes)
      }
      return reply.code(404)
        .send({
          statusCode: 404,
          status: 'Not Found!',
          message: 'Avatar is missing for user'
        })
    }
    return reply
      .code(400)
      .send({
        statusCode: 400,
        status: 'Bad request!',
        message: 'parameter hash is missing!'
      })
  } catch (err) {
    throw boom.boomify(err)
  }
}

/**
 * Get team members
 * @route GET /profile/team
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 */
exports.getTeam = async (request, reply) => {
  try {
    /** @type {JwtPayload} */
    const token = request.token
    return Profile.getTeam(token.sub)
  } catch (err) {
    throw boom.boomify(err)
  }
}

// https://docs.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-nodejs-console
