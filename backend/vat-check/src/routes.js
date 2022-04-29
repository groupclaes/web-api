const vatCheckController = require('./controllers/vat-check.controller')

module.exports = routes = [{
  method: 'GET',
  url: '',
  handler: vatCheckController.get,
  requiredPermissions: []
  // requiredPermissions: ['read:GroupClaes.EMP/vat-check']
}]