// Import controllers
const visits = require('./controllers/visits.controller')

module.exports = routes = [{
  method: 'GET',
  url: '',
  handler: visits.get
}, {
  method: 'POST',
  url: '',
  handler: visits.post
}]