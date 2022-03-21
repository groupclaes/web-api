const oe = require('@groupclaes/oe-connector')
const config = require('../config')

exports.get = async (req, reply) => {
  // GetContacts({comapny}, {user}, {test})

  const user = req.query.user ?? ''
  const company = req.query.company ?? 'GRO'
  const test = req.query.test == true

  if (test) {
    return reply.code(502)
      .send()
  }

  oe.configure(config.oeConnector)

  req.log.info('apco210b parameters', { company, user, test })
  
  const oeResponse = await oe.run('apco110b', [
    user,
    company,
    undefined
  ])

  req.log.info('apco110b result', { oeResponse })

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
  // PostContacts({company}, {user}, {test})

  const user = req.query.user ?? ''
  const company = req.query.company ?? 'GRO'
  const test = req.query.test == true
  const data = req.body

  if (test) {
    return reply.code(502)
      .send()
  }

  oe.configure(config.oeConnector)

  req.log.info('apco210b parameters', { company, user, test })

  const oeResponse = await oe.run('apco210b', [
    user,
    company,
    data,
    undefined
  ])

  req.log.info('apco210b result', { oeResponse })

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