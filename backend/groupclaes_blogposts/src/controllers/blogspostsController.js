// External dependencies
const boom = require('boom')
const Blogpost = require('../models/blogpostModel')
const { FastifyRequest, FastifyReply } = require('fastify')

// @desc Get news
// @route GET /v1/groupclaes/blogsposts
/**
 * 
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 */
exports.get = async (request, reply) => {
  try {
    const id = +request.params.id

    const page = +request.query.page || 0
    const itemCount = +request.query.itemCount || 24
    const company = request.query.company || 'dis'
    const type = +request.query.type || 1

    request.log.info({ page, itemCount, company, type, blogpostId: id }, 'Retrieving blogposts')

    const blogposts = await Blogpost.get(id, { page, itemCount, company, type })

    if (blogposts.verified) {
      return blogposts
    }
    return reply
      .status(401)
      .send({ verified: false, error: 'Wrong credentials' })
  } catch (err) {
    throw boom.boomify(err)
  }
}
