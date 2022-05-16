const root = '/usr/src/app'

exports.validatePath = function (u, r) {
  if (r === undefined) {
    r = root
  }
  if (u.indexOf('\0') !== -1)
    throw new Error('Access denied')

  // add an actual working regex later
  // if (!/^[a-zA-Z0-9\-_]+$/.test(u))
  //   throw new Error('Access denied')

  var p = u

  p = p.replace(/%2e/ig, '.')
  p = p.replace(/%2f/ig, '/')
  p = p.replace(/%5c/ig, '\\')
  p = p.replace(/^[\/\\]?/, '/')
  p = p.replace(/[\/\\]\.\.[\/\\]/, '/')

  return r + p

  var s = p.normalize(p).replace(/\\/g, '/')
  var ps = p.join(r, s)

  console.log('path: ', ps, r)

  if (ps.indexOf(r) !== 0)
    throw new Error('Access denied')

  return ps
}