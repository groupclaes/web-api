'use strict'
const path = require('path')

const root = '/usr/src/app'

exports.validatePath = function (u, r) {
  if (!r) {
    r = root
  }
  if (u.indexOf('\0') !== -1)
    throw new Error('Access denied')

  if (!/^[a-zA-Z0-9-_]+$/.test(u.split('.')[0]))
    throw new Error('Access denied')

  var p = u

  p = p.replace(/%2e/ig, '.')
  p = p.replace(/%2f/ig, '/')
  p = p.replace(/%5c/ig, '\\')
  p = p.replace(/^[\/\\]?/, '/')
  p = p.replace(/[\/\\]\.\.[\/\\]/, '/')

  var s = path.normalize(p).replace(/\\/g, '/')
  var ps = path.join(r, s)

  if (ps.indexOf(r) !== 0)
    throw new Error('Access denied')

  return ps
}