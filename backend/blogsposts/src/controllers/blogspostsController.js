// External Dependancies
const boom = require('boom')
const Blogpost = require('../models/blogpostModel')
const pcm = require('../providers/pcm')
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

    if (token) {
      request.log.warn({ token }, 'user supplied token!')
    }

    const blogposts = await Blogpost.get(id, { page, itemCount, company, type, token })

    if (blogposts.verified) {
      // get meta info for all blogposts
      for (let i = 0; i < blogposts.result.length; i++) {
        const blogpost = blogposts.result[i]
        if (blogpost.image) {
          const params = blogpost.image.replace('https://pcm.groupclaes.be/v3/i/', '').replace('https://pcm.groupclaes.be/v3/content/', '').split('/')
          if (params.length >= 4) {
            const metas = await pcm.getMetaInformation(params[0], params[1], params[2], params[3])
            if (metas && metas.length > 0)
              blogpost.meta = metas[0]
          }
        }
      }
      if (blogposts.extra_results) {
        // get meta info for all extra results
        for (let i = 0; i < blogposts.extra_results.length; i++) {
          const blogpost = blogposts.extra_results[i]
          if (blogpost.image) {
            const params = blogpost.image.replace('https://pcm.groupclaes.be/v3/i/', '').replace('https://pcm.groupclaes.be/v3/content/', '').split('/')
            if (params.length >= 4) {
              const metas = await pcm.getMetaInformation(params[0], params[1], params[2], params[3])
              if (metas && metas.length > 0)
                blogpost.meta = metas[0]
            }
          }
        }
      }

      return blogposts
    } else {
      request.log.warn({}, 'User is not verified!')
      reply
        .status(401)
        .send({
          verified: false,
          error: 'Wrong credentials'
        })
      return
    }
  } catch (err) {
    throw boom.boomify(err)
  }
}
