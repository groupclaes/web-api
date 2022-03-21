// Import controllers
const apco = require('./controllers/apco.controller')

module.exports = routes = [{
  method: 'GET',
  url: '/apco110b',
  handler: apco.get
}, {
  method: 'POST',
  url: '/apco210b',
  handler: apco.post
}]