// External Dependancies
const boom = require('boom')
const Subscriber = require('../models/subscriber.model')
const escape = require('lodash.escape')

// @desc Get all Subscribers or by email
// @route /distribution/subscribers/:hash
exports.get = async (req, reply) => {
  try {
    const email = req.params.id

    return await Subscriber.get(email)
  } catch (err) {
    throw boom.boomify(err)
  }
}

// @desc Create a new subsciber
// @route POST /distribution/subscribers
exports.post = async (req, reply) => {
  try {
    const culture = req.headers['accept-language']
    const email = escape(req.body.email || '')

    if (Subscriber.validateEmail(email)) {
      const result = await Subscriber.post({ email }, culture).catch(err => {
        return reply
          .code(409)
          .send({ result: false, reason: err })
      })

      if (result) {
        return reply
          .code(201)
          .send({ result: true })
      }
    }
    return reply
      .code(400)
      .send()
  } catch (err) {
    throw boom.boomify(err)
  }
}

// @desc Update existing subscriber info
// @route PUT /distribution/subscribers/:hash
exports.put = async (req, reply) => {
  try {
    const email = req.params.id
    const subscriber = req.body

    const result = await Subscriber.put(email, subscriber).catch(function (err) {
      return reply
        .code(400)
        .send({ result: false, reason: err })
    })

    if (result) {
      return reply
        .code(202)
        .send({ result: true })
    }
    return reply
      .code(400)
      .send()
  } catch (err) {
    throw boom.boomify(err)
  }
}

// @desc Remove subscriber with email hash
// @route DELETE /distribution/subscribers/:hash
exports.delete = async (req, reply) => {
  try {
    const email = req.params.id
    const result = await Subscriber.delete(email)

    if (result) {
      return reply
        .code(200)
        .send({ result })
    }
    return reply
      .code(404)
      .send()
  } catch (err) {
    throw boom.boomify(err)
  }
}