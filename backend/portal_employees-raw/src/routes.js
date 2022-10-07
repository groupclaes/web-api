// Import controllers
const employees = require('./controllers/employees.controller')

module.exports = routes = [{
  method: 'GET',
  url: '',
  handler: employees.get
}, {
  method: 'GET',
  url: '/:id',
  handler: employees.get
}]