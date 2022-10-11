const oe = require('@groupclaes/oe-connector')
const config = require('../config')

exports.get = async (request, reply) => {
  const user_id = request.params.id

  const user = request.query.user ?? ''
  const test = request.query.test == true

  if (test) {
    return reply
      .code(502)
      .send()
  }

  oe.configure(config.oeConnector)

  let oeResponse

  if (user_id !== undefined)
    oeResponse = await oe
      .run('getEmployee', [
        user,
        user_id,
        undefined
      ])
  else
    oeResponse = await oe
      .run('getEmployees', [
        user,
        undefined
      ])

  if (oeResponse && oeResponse.status === 200) {
    if (oeResponse.result) {
      if (oeResponse.result.id)
        return [oeResponse.result]
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

exports.put = async (request, reply) => {
  const user_id = request.params.id

  const user = request.query.user ?? ''
  const test = request.query.test == true

  if (test) {
    return reply
      .code(502)
      .send()
  }

  oe.configure(config.oeConnector)

  const oeResponse = await oe
    .run('putEmployee', [
      user,
      [request.body],
      undefined
    ])

  if (oeResponse && oeResponse.status === 200) {
    if (oeResponse.result) {
      return true
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