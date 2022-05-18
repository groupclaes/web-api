const statsController = require('./controllers/stats.controller')

module.exports = routes = [{
  method: 'GET',
  url: '/:name',
  handler: statsController.get,
  requiredPermissions: []
}]