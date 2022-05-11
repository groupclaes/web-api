const oe = require('@groupclaes/oe-connector')
const config = require('../config')

exports.get = async (req, reply) => {
  const user = req.query.user ?? ''
  const company = req.query.company ?? 'MAC'
  const test = req.query.test == true

  if (test) {
    return reply
      .code(502)
      .send()
  }

  oe.configure(config.oeConnector)

  const oeResponse = await oe
    .run('getVisitNotes', [
      user,
      company,
      undefined
    ])

  if (oeResponse && oeResponse.status === 200) {
    if (oeResponse.result) {
      return oeResponse.result
    } else {
      return reply
        .code(204)
        .send()
    }
  }

  return reply
    .code(oeResponse.status)
    .send(oeResponse)
}

exports.post = async (req, reply) => {
  const user = req.query.user ?? ''
  const company = req.query.company ?? 'MAC'
  const test = req.query.test == true
  const data = req.body

  if (test) {
    return reply
      .code(502)
      .send()
  }

  oe.configure(config.oeConnector)

  const oeResponse = await oe.run('postVisitNote', [
    user,
    company,
    data,
    undefined
  ])

  if (oeResponse && oeResponse.status === 200) {
    if (oeResponse.result) {
      return oeResponse.result
    } else {
      return reply
        .code(204)
        .send()
    }
  }

  return reply
    .code(oeResponse.status)
    .send(oeResponse)
}

exports.getCustomers = async (req, reply) => {
  const user = req.query.user ?? ''
  const company = req.query.company ?? 'MAC'
  const test = req.query.test == true

  if (test) {
    return reply
      .code(502)
      .send()
  }

  oe.configure(config.oeConnector)

  const oeResponse = await oe
    .run('getCustomers', [
      user,
      company,
      undefined
    ])

  if (oeResponse && oeResponse.status === 200) {
    if (oeResponse.result) {
      return oeResponse.result
    } else {
      return reply
        .code(204)
        .send()
    }
  }

  return reply
    .code(oeResponse.status)
    .send(oeResponse)
}