// External Dependancies
const boom = require('boom')
const Blogpost = require('../models/blogpostModel')
const { Request, Reply } = require('fastify')

// @desc Get news
// @route GET /v1/groupclaes/blogsposts
/**
 * 
 * @param {Request} request
 * @param {Reply} reply
 */
exports.get = async (request, reply) => {
  try {
    const id = +request.params.id

    const page = +request.query.page || 0
    const itemCount = +request.query.itemCount || 24
    const company = request.query.company || 'dis'
    const type = +request.query.type || 1

    const token = request.query.token

    if (!id) {
      request.log.info({ page, itemCount, company, type }, 'Retrieving all blogposts')
    } else {
      request.log.info({ blogpostId: id }, 'Retrieving single blogpost')
    }

    const blogposts = await Blogpost.get(id, { page, itemCount, company, type, token })

    if (blogposts.verified) return blogposts
    reply
      .status(401)
      .send({ verified: false, error: 'Wrong credentials' })
  } catch (err) {
    throw boom.boomify(err)
  }
}
