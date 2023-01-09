'use strict'

// Import controllers
const analytics = require('./controllers/analytics.controller')

exports.routes = [{
  method: 'GET',
  url: '/dashboard',
  handler: analytics.getDashboard,
  requiredPermissions: [] // 'read:GroupClaes.EMP/distribution/analytics'
}]