const oe = require('@groupclaes/oe-connector')
const config = require('../config')

exports.get = async (req, reply) => {
  const user = req.query.user ?? ''
  const company = req.query.company ?? 'GRO'
  const test = req.query.test == true

  if (test) {
    return reply.code(502)
      .send()
  }

  oe.configure(config.oeConnector)

  req.log.info('aptr100b.p parameters', { company, user, test })

  const oeResponse = await oe.run('aptr100b', [
    company,
    '0',
    undefined
  ])

  req.log.info('aptr100b result', { oeResponse })

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