// Import controllers
const orders = require('./controllers/orders.controller')

module.exports = routes = [{
  method: 'POST',
  url: '',
  handler: orders.post
}]