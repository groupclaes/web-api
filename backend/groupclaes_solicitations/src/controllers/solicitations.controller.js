/** External imports */
const boom = require('boom')
const { FastifyRequest, FastifyReply } = require('fastify')
const fs = require('fs')

/** Internal imports */
const config = require('../config')
const Solicitation = require('../models/solicitations.model')

/**
 * Post solicitation
 * @param {FastifyRequest} request 
 * @param {FastifyReply} reply 
 */
exports.post = async (request, reply) => {
  try {
    const solicitation = request.body

    request.log.debug({ solicitation }, 'received solicitation')

    const name = await Solicitation.getVacancyName(solicitation.vacancy || 0)
    const title = name !== null && name !== undefined ? name.nl : 'Open sollicitatie'
    const _fn = config.dataPath + 'data/temp/' + solicitation.document

    fs.accessSync(_fn, fs.constants.F_OK)

    const { email, prename, surname, phone } = solicitation

    const subject = `Sollicitatie ${prename} ${surname}`
    const recipients = [
      'hr@groupclaes.be'
    ]
    let body = Solicitation.getMailTemplate('solicitation', 'nl')
    body = body
      .replace(/\{name}/gi, title)
      .replace(/\{prename}/gi, prename)
      .replace(/\{surname}/gi, surname)
      .replace(/\{email}/gi, email)
      .replace(/\{phone}/gi, phone)
      .replace(/\{motivation}/gi, '')

    await Solicitation.sendMail(recipients.join(';'), subject, body, [_fn])

    body = Solicitation.getMailTemplate('solicitation_request', 'nl')
    body = body
      .replace(/\{prename}/gi, prename)
      .replace(/\{surname}/gi, surname)

    await Solicitation.sendMail(email, 'Ontvangstbevestiging sollicitatie', body)

    return {
      result: true,
      verified: true,
      error: null
    }
  } catch (err) {
    throw boom.boomify(err)
    // return {
    //   result: false,
    //   verified: true,
    //   error: err
    // }
  }
}

/**
 * Post solicitation file
 * @param {FastifyRequest} request 
 * @param {FastifyReply} reply 
 */
exports.postFile = async (request, reply) => {
  try {
    const data = await request.file()
    const _fn = config.dataPath + 'data/temp/' + data.filename

    fs.writeFileSync(_fn, await data.toBuffer())

    return {
      result: true,
      verified: true,
      error: null
    }
  } catch (err) {
    throw boom.boomify(err)
  }
}