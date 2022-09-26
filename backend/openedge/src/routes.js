// Import controllers
const apco = require('./controllers/apco.controller')
const aptr = require('./controllers/aptr.controller')
const swyx = require('./controllers/swyx.controller')

module.exports = routes = [{
  method: 'GET',
  url: '/apco110b',
  handler: apco.get
}, {
  method: 'POST',
  url: '/apco210b',
  handler: apco.post
}, {
  method: 'GET',
  url: '/aptr100b',
  handler: aptr.get
}, {
  method: 'GET',
  url: 'swyx/phonebook',
  handler: swyx.getPhonebook  // 08712200410511, 08712200034137 en 08712200437853
}]