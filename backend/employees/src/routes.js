const employeesController = require('./controllers/employees.controller')

exports.routes = [{
  method: 'GET',
  url: '/:id?',
  handler: employeesController.get,
  // requiredPermissions: ['read:GroupClaes.Login']
}]