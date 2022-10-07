const oe = require('@groupclaes/oe-connector')
const config = require('../config')

exports.get = async (req, reply) => {
  const user_id = req.param.id

  const user = req.query.user ?? ''
  const test = req.query.test == true

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