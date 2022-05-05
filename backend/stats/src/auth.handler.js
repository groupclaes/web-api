const { FastifyRequest, FastifyReply } = require('fastify')
const jwt = require('jsonwebtoken')

/**
 * 
 * @param {FastifyRequest} request 
 * @param {FastifyReply} reply
 * @param {function} done
 * @param {string[] | string} requiredPermissions 
 */
function handle(request, reply, done, requiredPermissions) {
  // if requiredPermissions is a string create array
  if (typeof requiredPermissions === 'string') {
    requiredPermissions = [requiredPermissions]
  }

  // check if bearer token is set
  let result = false
  let token
  if (request.headers.authorization != null) {
    const bearer_token = request.headers.authorization.substring(7)
    token = jwt.decode(bearer_token)

    if (token) {
      if (token.iss === 'https://sso.goupclaes.be' && token.exp > new Date().getTime() / 1000) {
        result = true
        //  token is valid, if perms are required check them
        for (let permission of requiredPermissions) {
          if (!validatePermission(token.roles, permission)) {
            result = false
          }
        }
      }
    } else {
      request.log.error({ requiredPermissions, url: request.raw.url, ip: request.ip }, 'Unauthorized')
      reply
        .code(401)
        .send()
    }
  } else {
    // temporarily disable this feature because we are migrating from old
    done()
    return
  }

  if (result) {
    request.token = token
    done()
  } else {
    request.log.error({ requiredPermissions, url: request.raw.url, ip: request.ip }, 'Access denied')
    reply
      .code(403)
      .send()
  }
}

/**
 * 
 * @param {string[]} roles 
 * @param {string} required 
 * @returns {boolean}
 */
function validatePermission(roles, permission) {
  return roles.some((x) => {
    const parts = x.split(':')
    const role = parts[0]
    const scopes = parts[1].split('/')

    const reqParts = permission.split(':')
    const reqPerm = reqParts[0]
    const reqScopes = reqParts[1].split('/')

    // check if role has permissions, ignore _all
    if (permissions[role].some((permission) => permission.split('_')[0] == reqPerm)) {
      // Check scope
      for (let i = 0; i < reqScopes.length; i++) {
        const scope = scopes[i]
        const reqScope = reqScopes[i]

        if (i === 0 && scope === reqScope) {
          continue
        } else if (i > 0 && scope === reqScope && i - 1 !== reqScope.length) {
          continue
        } else if (i > 0 && ((scope === reqScope && i - 1 === reqScope.length) || scope === '*')) {
          return true
        }
        return false
      }
      // fallback to true if requested scope is malformed
      return true
    }
  })
}

// cached version of perms
const permissions = {
  'admin': [
    'read_all',
    'write_all',
    'delete_all',
  ],
  'moderator': [
    'read_all',
    'write_all',
    'delete',
  ],
  'contributor': [
    'read_all',
    'write',
    'delete',
  ],
  'user': [
    'read',
    'write',
  ],
  'guest': [
    'read',
  ]
}

module.exports = {
  handle
}